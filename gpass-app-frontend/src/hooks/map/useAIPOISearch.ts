import { useState, useCallback } from 'react'
import { useGemini } from '@/hooks/ai/useGemini'
import { useNominatimSearch } from './useRouting'

// ─── Kategória & alkategória struktúra ────────────────────────────────────

export type POIMainCategory =
  | 'fuel'
  | 'atm'
  | 'pharmacy'
  | 'restaurant'
  | 'shop'
  | 'entertainment'
  | 'attraction'
  | 'accommodation'
  | 'post'

export type POISubCategory =
  // fuel
  | 'fuel_station' | 'ev_charger'
  // atm
  | 'atm_otp' | 'atm_kh' | 'atm_other'
  // restaurant
  | 'fast_food' | 'confectionery' | 'sit_down'
  // shop
  | 'grocery' | 'drugstore' | 'home_garden' | 'shop_other'
  // többinél nincs alkategória
  | null

export type POIFilters = {
  mainCategory: POIMainCategory | null
  subCategory: POISubCategory
  maxDistance: number  // km
}

export type POIResult = {
  name: string
  address: string
  lat: number
  lng: number
  category: POIMainCategory
  subCategory: POISubCategory
  description?: string
  openingHours?: string
  phone?: string
  brand?: string
}

export type SearchStep =
  | 'idle'
  | 'city-search'
  | 'overpass-search'
  | 'ai-rank'
  | 'complete'
  | 'error'

export type UseAIPOISearchReturn = {
  step: SearchStep
  selectedCity: { name: string; lat: number; lng: number } | null
  filters: POIFilters
  results: POIResult[]
  loading: boolean
  error: Error | null
  searchCity: (cityName: string) => Promise<void>
  selectCity: (city: { name: string; lat: number; lng: number } | null) => void
  setFilters: (f: Partial<POIFilters>) => void
  searchPOIs: () => Promise<void>
  reset: () => void
}

// ─── Overpass lekérdezések alkategóriánként ───────────────────────────────

function buildOverpassQuery(filters: POIFilters, lat: number, lng: number, radiusM: number): string {
  const { mainCategory, subCategory } = filters
  const around = `(around:${radiusM},${lat},${lng})`

  let tags: string[] = []

  switch (mainCategory) {
    case 'fuel':
      if (subCategory === 'ev_charger') {
        tags = [`node["amenity"="charging_station"]["name"]${around}`]
      } else {
        // fuel_station vagy nincs subcat → mindkettő
        tags = [
          `node["amenity"="fuel"]${around}`,
          `node["amenity"="charging_station"]${around}`,
        ]
      }
      break

    case 'atm':
      if (subCategory === 'atm_otp') {
        tags = [`node["amenity"="atm"]["operator"~"OTP",i]${around}`,
                `node["amenity"="bank"]["operator"~"OTP",i]${around}`]
      } else if (subCategory === 'atm_kh') {
        tags = [`node["amenity"="atm"]["operator"~"K&H|K H",i]${around}`,
                `node["amenity"="bank"]["operator"~"K&H|K H",i]${around}`]
      } else {
        tags = [`node["amenity"~"atm|bank"]["name"]${around}`]
      }
      break

    case 'pharmacy':
      tags = [`node["amenity"="pharmacy"]${around}`]
      break

    case 'restaurant':
      if (subCategory === 'fast_food') {
        tags = [`node["amenity"="fast_food"]["name"]${around}`]
      } else if (subCategory === 'confectionery') {
        tags = [`node["amenity"~"cafe|ice_cream"]["name"]${around}`,
                `node["shop"~"confectionery|bakery"]["name"]${around}`]
      } else {
        // sit_down vagy nincs subcat
        tags = [`node["amenity"~"restaurant|pub|bar"]["name"]${around}`]
      }
      break

    case 'shop':
      if (subCategory === 'grocery') {
        tags = [`node["shop"~"supermarket|convenience|greengrocer|butcher"]["name"]${around}`]
      } else if (subCategory === 'drugstore') {
        tags = [`node["shop"~"chemist|cosmetics|beauty"]["name"]${around}`]
      } else if (subCategory === 'home_garden') {
        tags = [`node["shop"~"furniture|hardware|garden|doityourself"]["name"]${around}`]
      } else {
        tags = [`node["shop"]["name"]${around}`]
      }
      break

    case 'entertainment':
      tags = [`node["amenity"~"nightclub|bar|pub|casino|cinema|theatre"]["name"]${around}`,
              `node["leisure"~"escape_game|bowling_alley"]["name"]${around}`]
      break

    case 'attraction':
      tags = [`node["tourism"~"attraction|museum|viewpoint|gallery"]["name"]${around}`,
              `node["historic"]["name"]${around}`]
      break

    case 'accommodation':
      tags = [`node["tourism"~"hotel|hostel|guest_house|motel"]["name"]${around}`]
      break

    case 'post':
      tags = [`node["amenity"="post_office"]${around}`,
              `node["amenity"="post_box"]${around}`]
      break

    default:
      tags = [`node["name"]${around}`]
  }

  return `[out:json][timeout:25];\n(\n  ${tags.join(';\n  ')};\n);\nout center 50;`
}

function getCategoryLabel(cat: POIMainCategory, sub: POISubCategory): string {
  const labels: Record<string, string> = {
    'fuel/fuel_station': 'benzinkutat',
    'fuel/ev_charger': 'töltőállomást',
    'fuel/null': 'benzinkutat vagy töltőállomást',
    'atm/atm_otp': 'OTP ATM-et vagy bankfiókot',
    'atm/atm_kh': 'K&H ATM-et vagy bankfiókot',
    'atm/null': 'ATM-et',
    'pharmacy/null': 'gyógyszertárat',
    'restaurant/fast_food': 'gyorséttermet',
    'restaurant/confectionery': 'cukrászdát vagy kávézót',
    'restaurant/sit_down': 'éttermet',
    'restaurant/null': 'éttermet vagy vendéglátóhelyet',
    'shop/grocery': 'élelmiszerüzletet',
    'shop/drugstore': 'drogériát',
    'shop/home_garden': 'lakás és kert boltot',
    'shop/null': 'boltot',
    'entertainment/null': 'szórakozóhelyet, bárt vagy kocsmát',
    'attraction/null': 'látnivalót',
    'accommodation/null': 'szállást',
    'post/null': 'postát',
  }
  return labels[`${cat}/${sub}`] ?? 'helyet'
}

const OVERPASS_SERVERS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

async function runOverpassQuery(query: string): Promise<any[]> {
  let lastError: Error | null = null

  for (const server of OVERPASS_SERVERS) {
    try {
      const res = await fetch(server, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(20000),
      })
      if (res.ok) {
        const data = await res.json()
        return data.elements ?? []
      }
      lastError = new Error(`Overpass hiba: ${res.status}`)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }
  throw lastError ?? new Error('Overpass API nem elérhető')
}

const DEFAULT_FILTERS: POIFilters = {
  mainCategory: null,
  subCategory: null,
  maxDistance: 5,
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAIPOISearch(): UseAIPOISearchReturn {
  const [step, setStep] = useState<SearchStep>('idle')
  const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [filters, setFiltersState] = useState<POIFilters>(DEFAULT_FILTERS)
  const [results, setResults] = useState<POIResult[]>([])
  const [error, setError] = useState<Error | null>(null)

  const { search: searchNominatim, searching: nomSearching } = useNominatimSearch()
  const { sendMessage: aiRank, loading: aiLoading, clearHistory: clearAIHistory } = useGemini()

  const loading = nomSearching || aiLoading

  const setFilters = useCallback((f: Partial<POIFilters>) => {
    setFiltersState(prev => ({ ...prev, ...f }))
  }, [])

  const searchCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return
    setStep('city-search')
    setError(null)
    try {
      const results = await searchNominatim(cityName)
      if (results.length === 0) throw new Error(`Nem találtam: "${cityName}"`)
      const city = results[0]
      setSelectedCity({
        name: city.display_name.split(',')[0],
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lon),
      })
      setStep('idle')
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setStep('error')
    }
  }, [searchNominatim])

  const searchPOIs = useCallback(async () => {
    if (!selectedCity || !filters.mainCategory) return

    setStep('overpass-search')
    setError(null)
    setResults([])
    clearAIHistory()

    try {
      const radiusM = filters.maxDistance * 1000
      const query = buildOverpassQuery(filters, selectedCity.lat, selectedCity.lng, radiusM)
      const elements = await runOverpassQuery(query)

      const rawPOIs = elements
        .filter((el: any) => el.tags?.name || filters.mainCategory === 'atm' || filters.mainCategory === 'pharmacy')
        .map((el: any) => {
          const elLat = el.lat ?? el.center?.lat
          const elLng = el.lon ?? el.center?.lon
          const tags = el.tags ?? {}
          const addressParts = [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean)
          return {
            name: tags.name || tags.operator || tags.brand || 'Névtelen',
            lat: elLat,
            lng: elLng,
            address: addressParts.join(' '),
            tags,
          }
        })
        .filter((el: any) => el.lat && el.lng)

      if (rawPOIs.length === 0) {
        throw new Error(`Nem találtam ${getCategoryLabel(filters.mainCategory!, filters.subCategory)} ${selectedCity.name} ${filters.maxDistance} km-es körzetében`)
      }

      const candidates = rawPOIs.slice(0, 25)

      setStep('ai-rank')

      const categoryLabel = getCategoryLabel(filters.mainCategory!, filters.subCategory)
      const candidateList = candidates
        .map((p: any, i: number) => {
          const extra = [
            p.tags['opening_hours'] && `nyitva: ${p.tags['opening_hours']}`,
            p.tags['brand'] && `márka: ${p.tags['brand']}`,
            p.tags['operator'] && `üzemeltető: ${p.tags['operator']}`,
            p.tags['phone'] && `tel: ${p.tags['phone']}`,
          ].filter(Boolean).join(', ')
          return `${i + 1}. ${p.name}${p.address ? ` – ${p.address}` : ''}${extra ? ` (${extra})` : ''}`
        })
        .join('\n')

      const subCatNote = filters.subCategory
        ? `\nFONTOS: Csak "${categoryLabel}" típusú helyeket adj vissza. Ha valamelyik pont nem illik ebbe a kategóriába, hagyd ki!`
        : ''

      const prompt = `Az alábbi valós ${categoryLabel} lista ${selectedCity.name} városból (OpenStreetMap adatok):

${candidateList}
${subCatNote}

Válaszd ki a legjobb 5-öt (legmegbízhatóbbnak tűnőket) és adj rövid magyar leírást (max 1 mondat).
Hagyd ki, ami nyilvánvalóan bezárt, lezárt vagy nem releváns.

Válaszolj KIZÁRÓLAG JSON formátumban:
[{"index": 1, "description": "leírás", "openingHours": "nyitvatartás vagy null"}]`

      const aiResponse = await aiRank(prompt)

      let ranked: Array<{ index: number; description: string; openingHours?: string }> = []
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
          if (jsonMatch) ranked = JSON.parse(jsonMatch[0])
        } catch { /* fallback */ }
      }

      let finalPOIs: POIResult[]

      if (ranked.length > 0) {
        finalPOIs = ranked.slice(0, 5).map((r) => {
          const poi = candidates[r.index - 1]
          if (!poi) return null
          return {
            name: poi.name,
            address: poi.address,
            lat: poi.lat,
            lng: poi.lng,
            category: filters.mainCategory!,
            subCategory: filters.subCategory,
            description: r.description ?? undefined,
            openingHours: r.openingHours || poi.tags['opening_hours'],
            phone: poi.tags['phone'] || poi.tags['contact:phone'],
            brand: poi.tags['brand'] || poi.tags['operator'],
          } as POIResult
        }).filter((p): p is POIResult => p !== null)
      } else {
        finalPOIs = candidates.slice(0, 5).map((poi: any) => ({
          name: poi.name,
          address: poi.address,
          lat: poi.lat,
          lng: poi.lng,
          category: filters.mainCategory!,
          subCategory: filters.subCategory,
          openingHours: poi.tags['opening_hours'],
          brand: poi.tags['brand'] || poi.tags['operator'],
        }))
      }

      setResults(finalPOIs)
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setStep('error')
    }
  }, [selectedCity, filters, aiRank, clearAIHistory])

  const reset = useCallback(() => {
    setStep('idle')
    setSelectedCity(null)
    setFiltersState(DEFAULT_FILTERS)
    setResults([])
    setError(null)
  }, [])

  return {
    step, selectedCity, filters, results, loading, error,
    searchCity, selectCity: setSelectedCity, setFilters, searchPOIs, reset,
  }
}

export default useAIPOISearch
