# 🚀 Gyors Kezdés - Gemini AI Chat

## ⚡ 5 Lépés az Integrációhoz

### 1️⃣ API Key Beszerzése (2 perc)
```
https://aistudio.google.com/app/apikey
↓
Create API Key → Copy
```

### 2️⃣ Environment Variable Beállítása
Hozz létre `.env.local` a projekt gyökerében:
```bash
VITE_GEMINI_API_KEY=paste-your-key-here
```

### 3️⃣ Csomag Telepítése
```bash
npm install
```

Az `@google/generative-ai` már hozzá van adva a `package.json`-hoz!

### 4️⃣ Dev Server Indítása
```bash
npm run dev
```

### 5️⃣ Chat Oldal Megnyitása
Navigálj a `/ai-chat` route-ra:
```
http://localhost:3000/ai-chat
```

---

## 📁 Mit Adtam Hozzá?

```
src/
├── hooks/
│   └── ai/
│       └── useGemini.ts          ← Az AI hook
├── components/
│   └── ai/
│       └── AIChat.tsx             ← A chat komponens
├── routes/
│   └── ai-chat.lazy.tsx           ← A chat oldal route
└── ...

.env.local.example                 ← Template
AI_INTEGRATION.md                  ← Teljes dokumentáció
QUICK_START.md                     ← Ez a fájl
```

---

## 💡 Hogyan Használd?

### A Chat Komponenst Máshol is Beágyazhatod

```tsx
// Bárhol az alkalmazásban
import { AIChat } from '@/components/ai/AIChat'

export function MyPage() {
  return (
    <div className="h-screen flex flex-col">
      <AIChat className="flex-1" />
    </div>
  )
}
```

### Vagy Csak a Hook-ot Használd

```tsx
import { useGemini } from '@/hooks/ai/useGemini'

export function MyComponent() {
  const { response, loading, error, sendMessage } = useGemini()

  return (
    <div>
      <button onClick={() => sendMessage('Szia!')}>
        Ask AI
      </button>
      {loading && <p>Gondolkodás...</p>}
      {response && <p>{response}</p>}
    </div>
  )
}
```

---

## ✅ Ellenőrzöd

- [ ] `.env.local` megvan az API key-vel
- [ ] `npm install` lefutott
- [ ] `npm run dev` fut
- [ ] `/ai-chat` route elérhető
- [ ] Üzenet küldése működik

---

## 🐛 Ha Nem Működik

### ❌ "API key nincs beállítva"
→ Ellenőrizd a `.env.local` fájlt és a kulcs nevét (`VITE_GEMINI_API_KEY`)

### ❌ "Network error"
→ Az API key lehet hibás, vagy nincs internet

### ❌ "404 - route not found"
→ A `src/routes/ai-chat.lazy.tsx` fájl nem található. Másold be a routes mappába!

### ❌ "Module not found: @google/generative-ai"
→ Fuss le: `npm install @google/generative-ai`

---

## 📖 Több Info

Lásd az `AI_INTEGRATION.md` fájlt részletes dokumentációért!

---

**Kész? Happy coding! 🎉**
