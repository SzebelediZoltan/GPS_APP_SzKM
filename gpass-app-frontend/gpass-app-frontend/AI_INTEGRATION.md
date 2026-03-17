# 🤖 Gemini AI Chat Integráció - GPASS Frontend

Ez a dokumentáció az useGemini hook és AIChat komponens integrációjáról szól a GPASS projektbe.

## 📋 Tartalom

- [Telepítés](#telepítés)
- [Beállítás](#beállítás)
- [Használat](#használat)
- [Hook API](#hook-api)
- [Komponens API](#komponens-api)

---

## 📦 Telepítés

A szükséges csomag már hozzáadva van a `package.json`-hoz:

```bash
npm install
```

Vagy ha manuálisan szeretnéd hozzáadni:

```bash
npm install @google/generative-ai
```

---

## ⚙️ Beállítás

### 1. API Key beszerzése

1. Nyisd meg a [Google AI Studio](https://aistudio.google.com/app/apikey)-t
2. Kattints az "Create API Key" gombra
3. Válaszd ki "Create new secret key in new project"-et
4. Másold be az API keyed

### 2. Environment Variable beállítása

Hozz létre egy `.env.local` fájlt a projekt gyökerében (másolhatod a `.env.local.example`-t):

```env
VITE_GEMINI_API_KEY=your-actual-api-key-here
```

**Fontos:**
- ⚠️ Soha ne commiteld be a `.env.local` fájlt!
- ✅ Már van `.gitignore` szabály rá
- 🔄 A dev szerver újraindítása szükséges az environment változó módosítása után

---

## 🚀 Használat

### Hook Használata

```tsx
import { useGemini } from '@/hooks/ai/useGemini'

function MyComponent() {
  const { response, loading, error, sendMessage, conversationHistory, clearHistory } =
    useGemini()

  const handleClick = async () => {
    await sendMessage('Szia, Gemini!')
    console.log(response) // A válasz elérhető
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Feldolgozás...' : 'Kérdés'}
      </button>
      {error && <p>{error.message}</p>}
      {response && <p>{response}</p>}
    </div>
  )
}
```

### Komponens Használata

```tsx
import { AIChat } from '@/components/ai/AIChat'

function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      <AIChat className="flex-1 p-4" />
    </div>
  )
}
```

### Router-ben Integráció

A GPASS TanStack Router-t használ. Hozz létre egy új route-ot az AI chat-hez:

```tsx
// src/routes/chat.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import { AIChat } from '@/components/ai/AIChat'

export const Route = createLazyFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b bg-card p-4">
        <h1 className="text-2xl font-bold">Gemini AI Chat</h1>
      </header>
      <AIChat className="flex-1" />
    </div>
  )
}
```

Majd add hozzá a route-ot a `routeTree`-hez vagy a `root.tsx`-ben:

```tsx
// src/routes/__root.tsx
// ... existing imports
import { Route as ChatRoute } from './chat.lazy'

// A router konfig-ban:
const routeTree = {
  // ... existing routes
  children: [
    // ... other children
    ChatRoute,
  ],
}
```

---

## 🪝 Hook API

### `useGemini(options?): UseGeminiReturn`

#### Paraméterek

```typescript
type UseGeminiOptions = {
  modelName?: string  // Alapértelmezett: 'gemini-1.5-flash'
  apiKey?: string     // Ha nincs megadva, VITE_GEMINI_API_KEY-t használ
}
```

#### Visszatérési értékek

```typescript
type UseGeminiReturn = {
  response: string                    // Az utolsó AI válasz
  loading: boolean                    // Feldolgozás alatt?
  error: Error | null                 // Hibaüzenet (ha van)
  sendMessage: (userMessage: string) => Promise<string | null>
  conversationHistory: ConversationMessage[]
  clearHistory: () => void            // Előzmények és state törlése
  resetError: () => void              // Hibaüzenet törlése
}
```

#### Típusok

```typescript
type ConversationMessage = {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}
```

#### Példa

```typescript
const {
  response,           // string
  loading,            // boolean
  error,              // Error | null
  sendMessage,        // async (msg: string) => Promise<string | null>
  conversationHistory,// ConversationMessage[]
  clearHistory,       // () => void
  resetError,         // () => void
} = useGemini({ modelName: 'gemini-1.5-pro' })

// Üzenet küldése
const result = await sendMessage('Mi az AI?')
// result: string | null

// Előzmények megtekintése
console.log(conversationHistory)
// [{role: 'user', parts: [{text: 'Mi az AI?'}]}, ...]

// Törlés
clearHistory() // Mindent töröl
resetError()   // Csak a hibát
```

---

## 🎨 Komponens API

### `AIChat`

Egy teljes chattikai komponens előzménnyel, hibakezeléssel és Sonner toast-okkal.

#### Props

```typescript
interface AIChatProps {
  className?: string // Zusätzliche CSS-Klassen
}
```

#### Jellemzők

- ✅ Real-time üzenetküldés
- ✅ Automatikus scrolling az utolsó üzenethez
- ✅ Előzmények kezelése
- ✅ Hibajelzés és hibaüzenet
- ✅ Loading state és spinner
- ✅ Előzmények törlése gomb
- ✅ Sonner toast notifikációk

#### Style

- **Tailwind CSS** - Az alkalmazás design rendszerét követi
- **Dark mode** - Next-themes integrált (ha van)
- **Responsive** - Mobile és desktop kompatibilis
- **Accessible** - ARIA attribútumok, keyboard navigation

---

## 🔧 Beállítási Opciók

### Modell Kiválasztása

```typescript
// Flash (gyors, olcsó)
useGemini({ modelName: 'gemini-1.5-flash' })

// Pro (nagyobb, pontosabb)
useGemini({ modelName: 'gemini-1.5-pro' })

// 2.0 (legújabb)
useGemini({ modelName: 'gemini-2.0-flash' })
```

### Timeout Kezelés

A hook nem kezel timeout-ot alapértelmezés szerint. Ha szükséges:

```typescript
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    ),
  ])
}

const result = await withTimeout(sendMessage(text), 30000) // 30 másodperc
```

---

## ⚠️ Hibakezelés

### Hiányzó API Key

```
Gemini API key nincs beállítva. Add meg a VITE_GEMINI_API_KEY-t a .env.local fájlban!
```

**Megoldás:**
1. Ellenőrizd, hogy van-e `.env.local` fájl
2. Másold be az API keyed
3. Indítsd újra a dev szervert

### API Rate Limiting

Az ingyenes verziónak van korlátozása. Ha elfogyott az előirányzat:

```typescript
if (error?.message.includes('429')) {
  console.log('Túl sok kérés! Várj egy kicsit.')
}
```

### Network Error

Ha nincs internet vagy a request blokkolva van:

```typescript
if (error?.message.includes('network') || error?.message.includes('fetch')) {
  console.log('Hálózati probléma!')
}
```

---

## 📊 Performancia Tippek

- ✅ **Reuse hook instances** - Ne hozz létre új hook-ot minden render-ben
- ✅ **Kezelj hibákat** - Mindig ellenőrizd az `error` state-et
- ✅ **Töröld az előzményeket** - Ha túl sok üzenet lesz, memória probléma lehet
- ✅ **Loading state** - Tiltsd le az inputot, amíg feldolgozás folyik
- ✅ **Debounce input** - Ha van auto-complete, debounce-olj legalább 300ms-vel

---

## 🔗 Hasznos Linkek

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini API Dokumentáció](https://ai.google.dev/docs)
- [Google Generative AI JS SDK](https://github.com/google/generative-ai-js)
- [GPASS GitHub](https://github.com/SzebeleziZoltan/GPS_APP_SzKM)

---

## ❓ GYIK

### Q: Az API key biztonságban van a frontend-ben?
A: A Vite `VITE_` prefixet belelzet az environment változóba. Az API key a frontend kódban lesz, de az key-hez korlátoznod kell az API-t (pl. domain whitelist, IP restrict).

### Q: Lehet offline is használni?
A: Nem, a Gemini API-hoz internet szükséges.

### Q: Mennyibe kerül?
A: Az ingyenes verzió limitált, de ráadásnak szabad. Részletekért lásd a [Google AI pricing](https://ai.google.dev/pricing).

### Q: Lehet saját backend-en keresztül hívni?
A: Igen! Módosítsd a `useGemini.ts`-ben a `sendMessageAsync` mutációt, hogy a saját backend-ed felé hívjon.

---

**Kész az integráció! 🎉**

Ha van kérdés vagy hiba, nyiss egy issue-t a GitHub-on.
