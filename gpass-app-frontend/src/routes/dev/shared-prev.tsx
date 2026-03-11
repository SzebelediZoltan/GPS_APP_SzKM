import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  AlertTriangle, WifiOff, Lock, MapPin, Users, Flag,
  Map, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/dev/shared-prev")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: SharedPreviewPage,
})

// ── StatBox mock (nem importáljuk, hogy ne kelljen context) ──
function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-background/40 px-3 py-3 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-lg font-black text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
    </div>
  )
}

// ── NotLoggedIn mock ──
function NotLoggedInMock() {
  return (
    <div className="flex w-full justify-center px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl border-border/60 bg-card/60 shadow-lg backdrop-blur">
        <CardContent className="space-y-6 py-10 text-center">
          <div className="flex justify-center">
            <div className="rounded-full border border-border/60 bg-background/60 p-4">
              <Lock className="h-7 w-7 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Be kell jelentkezned</h2>
            <p className="text-sm text-muted-foreground">Ez az oldal csak bejelentkezett felhasználóknak érhető el.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button className="rounded-xl">Bejelentkezés</Button>
            <Button variant="outline" className="rounded-xl">Regisztráció</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── LoadingPage mock ──
function LoadingPageMock() {
  return (
    <div className="flex min-h-50 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-border/30" />
          <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Betöltés...</p>
      </div>
    </div>
  )
}

// ── ServerErrorPage mock ──
function ServerErrorPageMock() {
  return (
    <div className="flex w-full justify-center px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl border-border/60 bg-card/60 shadow-lg backdrop-blur">
        <CardContent className="space-y-6 py-10 text-center">
          <div className="flex justify-center">
            <div className="rounded-full border border-border/60 bg-background/60 p-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Szerver hiba történt</h2>
            <p className="text-sm text-muted-foreground">A szerver jelenleg nem érhető el, kérjük próbáld meg később.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button className="rounded-xl"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Újratöltés</Button>
            <Button variant="outline" className="rounded-xl">Főoldal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── OfflinePage mock ──
function OfflinePageMock() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full border border-border/60 bg-card/60 p-6 shadow-lg">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Nincs internetkapcsolat</h1>
        <p className="text-sm text-muted-foreground">
          Úgy tűnik, jelenleg offline vagy. Ellenőrizd az internetkapcsolatod, majd próbáld újra.
        </p>
        <Button className="rounded-xl">Újrapróbálás</Button>
      </div>
    </div>
  )
}

// ── Fő oldal ──
function SharedPreviewPage() {
  const SECTIONS = [
    { id: "notloggedin", label: "NotLoggedIn" },
    { id: "loading",     label: "LoadingPage" },
    { id: "servererror", label: "ServerErrorPage" },
    { id: "offline",     label: "OfflinePage" },
    { id: "statbox",     label: "StatBox" },
  ]

  const [active, setActive] = useState("notloggedin")

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" />
            Dev Preview
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shared Components</h1>
              <p className="mt-1 text-muted-foreground text-sm">Közös oldalak és UI elemek</p>
            </div>
            <Link to="/dev" className="text-xs text-muted-foreground hover:text-foreground transition">← Vissza</Link>
          </div>
        </div>

        {/* Tab navigáció */}
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                active === s.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/60 border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Preview terület */}
        <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden">

          {/* Fejléc csík */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-card/40">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-1">
              {SECTIONS.find(s => s.id === active)?.label}.tsx
            </span>
          </div>

          {/* Tartalom */}
          <div className="p-4">
            {active === "notloggedin" && <NotLoggedInMock />}
            {active === "loading"     && <LoadingPageMock />}
            {active === "servererror" && <ServerErrorPageMock />}
            {active === "offline"     && <OfflinePageMock />}
            {active === "statbox"     && (
              <div className="space-y-4 p-4">
                <p className="text-xs text-muted-foreground">Profil oldalon használt statisztika dobozok:</p>
                <div className="grid grid-cols-3 gap-3">
                  <StatBox icon={<MapPin className="h-4 w-4" />} label="Tripek"  value="12" />
                  <StatBox icon={<Users  className="h-4 w-4" />} label="Barátok" value="8"  />
                  <StatBox icon={<Flag   className="h-4 w-4" />} label="Klánok"  value="3"  />
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">Nulla értékkel:</p>
                <div className="grid grid-cols-3 gap-3">
                  <StatBox icon={<MapPin className="h-4 w-4" />} label="Tripek"  value="0" />
                  <StatBox icon={<Users  className="h-4 w-4" />} label="Barátok" value="0" />
                  <StatBox icon={<Flag   className="h-4 w-4" />} label="Klánok"  value="0" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
