import Header from '@/components/header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { ArrowRight, Car, Download, MapPin, Shield, Sparkles, Star, Table, TrafficCone, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

type User = {
  username: string,
  email: string,
}

const getUser = ()=> {
  return axios.get<User>("http://localhost:4000/api/auth/status",{withCredentials:true})
}

const logOut = () => {
  return axios.delete("http://localhost:4000/api/auth/logout", {withCredentials:true})
}

function RouteComponent() {

  const nav = useNavigate()

  const {mutate: logout} = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      nav({
        to: "/auth/login"
      })
    }
  })

  const {data: user,isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: getUser
  })

  if(isLoading) return <p>Töltés</p>
  if(!user) return <p>Nincs felhasználó</p>
  
  

  return <div><Header></Header>
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Háttérkép (Unsplash) */}
        <a
          href="https://unsplash.com/photos/traffic-on-road-during-night-time-9-Qd6JQJEgQ"
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 opacity-35 hover:opacity-40 transition-opacity"
          aria-label="Background image credit"
        >
          <img
            src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2000&auto=format&fit=crop"
            alt="Night city traffic"
            className="h-full w-full object-cover"
          />
        </a>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 text-slate-900">
              <Sparkles className="h-4 w-4" />
              Közösségi navigáció — valós idejű forgalom
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Menj gyorsabban, okosabban, biztonságosabban.
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Fedezd fel a közösség erejét: balesetek, traffipaxok, dugók és lezárások valós időben. Mindez egyetlen, letisztult felületen.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" /> App letöltése
              </Button>
              <Button size="lg" variant="secondary" className="gap-2">
                <Car className="h-5 w-5" /> Útvonal tervezése
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Users className="h-5 w-5" /> Csatlakozz a közösséghez
              </Button>
            </div>

            <Alert className="mt-8 bg-slate-800/60 border-slate-700">
              <TrafficCone className="h-5 w-5" />
              <AlertTitle>Forgalmi figyelmeztetés</AlertTitle>
              <AlertDescription>
                Erős torlódás az M1 bevezetőn. Javasolt kerülő: 1-es főút — 12 perc megtakarítás.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </section>

      {/* FŐ FUNKCIÓK — Kártyák */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-5 w-5" /> Valós idejű térkép
              </CardTitle>
              <CardDescription>
                Jelentések a közösségtől: baleset, veszély, rendőrség, lezárás.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                alt="Map preview"
                className="h-40 w-full rounded-xl object-cover"
              />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Baleset</Badge>
                <Badge variant="outline">Lezárás</Badge>
                <Badge variant="outline">Traffipax</Badge>
                <Badge variant="outline">Veszély</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="gap-2">
                Felfedezés <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5" /> Közösségi jelentések
              </CardTitle>
              <CardDescription>
                Több millió sofőr segít gyorsabban célba érni.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1536924430914-91f9e2041b33?q=80&w=1200&auto=format&fit=crop"
                alt="Community driving"
                className="h-40 w-full rounded-xl object-cover"
              />
              <p className="text-sm text-slate-300">
                Jelents te is eseményeket, pontokat gyűjthetsz és segítesz másoknak.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="gap-2">
                Hogyan működik? <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5" /> Biztonság és kényelem
              </CardTitle>
              <CardDescription>
                Hangvezérlés, sebességhatár jelzés, útvonal-alternatívák.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
                alt="Safe driving"
                className="h-40 w-full rounded-xl object-cover"
              />
              <div className="flex flex-wrap gap-2">
                <Badge>Hangvezérlés</Badge>
                <Badge>Alternatív útvonal</Badge>
                <Badge>Limit jelzés</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="gap-2">
                Tudj meg többet <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl bg-slate-800" />

      {/* TABS — App platformok / Közösségi statok */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <Tabs defaultValue="letoltes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="letoltes">Letöltés</TabsTrigger>
            <TabsTrigger value="statisztika">Közösségi statisztikák</TabsTrigger>
            <TabsTrigger value="ertekelesek">Értékelések</TabsTrigger>
          </TabsList>

          <TabsContent value="letoltes" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" /> iOS & Android
                  </CardTitle>
                  <CardDescription>Ingyenes navigáció, közösségi jelentésekkel.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <a
                    className="inline-flex"
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download on the App Store"
                      className="h-12"
                    />
                  </a>
                  <a
                    className="inline-flex"
                    href="https://play.google.com/store/apps"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-12"
                    />
                  </a>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-slate-400">Külső linkek — hivatalos áruházak.</p>
                </CardFooter>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader>
                  <CardTitle>Webes élmény</CardTitle>
                  <CardDescription>Asztali böngészőből is tervezhetsz útvonalat.</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="https://unsplash.com/photos/person-holding-iphone-6-qBhpPxZ9-cQ"
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1458063048042-9f1f4f9fd79a?q=80&w=1200&auto=format&fit=crop"
                      alt="Using navigation app"
                      className="h-48 w-full rounded-xl object-cover"
                    />
                  </a>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="gap-2">
                    Nyisd meg a webes térképet <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statisztika" className="mt-8">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle>Közösségi statisztikák (minta)</CardTitle>
                <CardDescription>Valós idejű, közösség által beküldött események összegzése.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Az adatok szemléltető jellegűek.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Kategória</TableHead>
                      <TableHead>Mai jelentések</TableHead>
                      <TableHead>Elmúlt 7 nap</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Baleset</TableCell>
                      <TableCell>124</TableCell>
                      <TableCell>812</TableCell>
                      <TableCell className="text-right">↗︎ 12%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Lezárás</TableCell>
                      <TableCell>57</TableCell>
                      <TableCell>390</TableCell>
                      <TableCell className="text-right">↘︎ 4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Traffipax</TableCell>
                      <TableCell>88</TableCell>
                      <TableCell>605</TableCell>
                      <TableCell className="text-right">→ 0%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Veszély</TableCell>
                      <TableCell>145</TableCell>
                      <TableCell>1030</TableCell>
                      <TableCell className="text-right">↗︎ 7%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ertekelesek" className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-slate-900/60 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="h-5 w-5" /> 4.{i} / 5
                    </CardTitle>
                    <CardDescription>Felhasználói értékelés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      „Gyors kerülőket ajánl és pontos a forgalmi adatokban. Minden nap használom munkába menet.”
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary" className="text-slate-900">Ellenőrzött vélemény</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Separator className="mx-auto max-w-7xl bg-slate-800" />

      {/* KÉPGALÉRIA — külső linkekkel */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-semibold">Hangulatképek</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "https://unsplash.com/photos/turned-on-gray-apple-iphone-xyPxcbaT8Lk",
              src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
              alt: "iPhone with navigation",
            },
            {
              href: "https://unsplash.com/photos/white-vehicle-on-road-during-night-time-1VqHRwxcCCw",
              src: "https://images.unsplash.com/photo-1519608425089-7f3bfa6f6bb8?q=80&w=1200&auto=format&fit=crop",
              alt: "Night driving lights",
            },
            {
              href: "https://unsplash.com/photos/gray-car-on-road-during-daytime-7uXn7nudorc",
              src: "https://images.unsplash.com/photo-1515419682769-91a8a6bdaf5a?q=80&w=1200&auto=format&fit=crop",
              alt: "Open road",
            },
            {
              href: "https://unsplash.com/photos/person-holding-mobile-phone-5E5N49RWtbA",
              src: "https://images.unsplash.com/photo-1510552776732-01acc9a4c1c4?q=80&w=1200&auto=format&fit=crop",
              alt: "Reporting from the phone",
            },
          ].map((img, idx) => (
            <a key={idx} href={img.href} target="_blank" rel="noreferrer" className="group relative block">
              <img
                src={img.src}
                alt={img.alt}
                className="h-48 w-full rounded-2xl object-cover transition-transform group-hover:scale-[1.02]"
              />
            </a>
          ))}
        </div>
      </section>

      {/* CTA LÁBLÉC helyett — fejléc nélkül is zárjuk a főoldalt */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-5 w-5" /> Kezdd el még ma
            </CardTitle>
            <CardDescription>
              Töltsd le az appot és spórolj időt minden utadon.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="gap-2">
              <Download className="h-5 w-5" /> Ingyenes letöltés
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <MapPin className="h-5 w-5" /> Demó útvonal
            </Button>
          </CardContent>
          <CardFooter className="text-sm text-slate-400">
            A képek az <a className="underline underline-offset-4" href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a> gyűjteményéből származnak — kattints a képekre a forrásért.
          </CardFooter>
        </Card>
      </section>
    </div>
    </div>
}
