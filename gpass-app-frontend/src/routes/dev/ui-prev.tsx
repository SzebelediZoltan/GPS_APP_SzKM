import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState } from "react"
import {
  ChevronDown, LogOut, Settings, User, Users, Menu,
  Sun, Moon, Map
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute("/dev/ui-prev")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/" })
  },
  component: UiPreviewPage,
})

// ── NavLink mock ──
function NavLink({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className={`rounded-xl px-3 py-2 text-sm cursor-pointer transition select-none ${
      active
        ? "bg-accent text-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`}>
      {label}
    </span>
  )
}

// ── ThemeSwitch mock (standalone, nem hívja a contextet) ──
function ThemeSwitchMock() {
  const [dark, setDark] = useState(true)
  return (
    <button
      onClick={() => setDark(!dark)}
      className="w-9 h-9 rounded-xl border border-border/70 bg-card/50 text-muted-foreground hover:bg-card/70 hover:text-foreground flex items-center justify-center cursor-pointer transition"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

// ── UserDropdown mock ──
function UserDropdownMock({ username, isAdmin }: { username: string; isAdmin?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-1.5 text-sm font-medium hover:bg-card/70 transition cursor-pointer">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <span>{username}</span>
          {isAdmin && <Badge className="rounded-full text-[10px] px-1.5 h-4">Admin</Badge>}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
          <User className="h-4 w-4" /> Profil
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
          <Users className="h-4 w-4" /> Barátok
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
          <Settings className="h-4 w-4" /> Beállítások
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" /> Kijelentkezés
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Header mock — bejelentkezett ──
function HeaderLoggedIn({ username, isAdmin }: { username: string; isAdmin?: boolean }) {
  return (
    <header className="w-full border border-border/60 rounded-xl bg-background/70 backdrop-blur overflow-hidden">
      <div className="flex h-16 items-center justify-between px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm">G</div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary via-sky-500 to-indigo-500 bg-clip-text text-transparent">
            GPASS
          </span>
        </div>

        {/* Nav + actions */}
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1">
            <NavLink label="Térkép" active />
            <NavLink label="Rólunk" />
            <NavLink label="Kapcsolat" />
            <NavLink label="Klánok" />
          </nav>
          <ThemeSwitchMock />
          <Separator orientation="vertical" className="h-6 opacity-50 hidden md:block" />
          <div className="hidden md:block">
            <UserDropdownMock username={username} isAdmin={isAdmin} />
          </div>
          <button className="md:hidden w-9 h-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-accent transition">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

// ── Header mock — vendég ──
function HeaderGuest() {
  return (
    <header className="w-full border border-border/60 rounded-xl bg-background/70 backdrop-blur overflow-hidden">
      <div className="flex h-16 items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm">G</div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary via-sky-500 to-indigo-500 bg-clip-text text-transparent">
            GPASS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1">
            <NavLink label="Térkép" />
            <NavLink label="Rólunk" />
            <NavLink label="Kapcsolat" />
            <NavLink label="Klánok" />
          </nav>
          <ThemeSwitchMock />
          <Separator orientation="vertical" className="h-6 opacity-50 hidden md:block" />
          <Button variant="outline" className="rounded-xl hidden md:inline-flex cursor-pointer">
            Bejelentkezés
          </Button>
          <button className="md:hidden w-9 h-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-accent transition">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

// ── Mobile sheet mock ──
function MobileMenuMock({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-border/60 bg-background shadow-xl p-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-xs">G</div>
          <span className="font-bold text-sm bg-gradient-to-r from-primary via-sky-500 to-indigo-500 bg-clip-text text-transparent">GPASS</span>
        </div>
        <span className="text-xs text-muted-foreground">mobil menü</span>
      </div>

      {/* Nav linkek */}
      <div className="space-y-1">
        {["Térkép", "Rólunk", "Kapcsolat", "Klánok"].map((label) => (
          <div key={label} className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition">
            {label}
          </div>
        ))}
      </div>

      <Separator />

      {/* Auth szekció */}
      {loggedIn ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground px-1">Fiók</p>
          <div className="rounded-xl border border-border/70 bg-card/30 overflow-hidden divide-y divide-border/40">
            {[
              { icon: <User className="h-4 w-4" />, label: "Profil" },
              { icon: <Users className="h-4 w-4" />, label: "Barátok" },
              { icon: <Settings className="h-4 w-4" />, label: "Beállítások" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent cursor-pointer transition">
                <span className="text-muted-foreground">{item.icon}</span>
                {item.label}
              </div>
            ))}
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 cursor-pointer transition">
              <LogOut className="h-4 w-4" /> Kijelentkezés
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Button className="w-full rounded-xl">Bejelentkezés</Button>
          <Button variant="outline" className="w-full rounded-xl">Regisztráció</Button>
        </div>
      )}

      {/* Theme */}
      <div className="pt-1">
        <ThemeSwitchMock />
      </div>
    </div>
  )
}

// ── Fő oldal ──
function UiPreviewPage() {
  const TABS = [
    { id: "header-auth",  label: "Header — belépve" },
    { id: "header-admin", label: "Header — admin" },
    { id: "header-guest", label: "Header — vendég" },
    { id: "mobile-auth",  label: "Mobil menü — belépve" },
    { id: "mobile-guest", label: "Mobil menü — vendég" },
    { id: "themeswitch",  label: "ThemeSwitch" },
  ]
  const [active, setActive] = useState("header-auth")

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

        {/* Fejléc */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5" /> Dev Preview
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">UI Components</h1>
              <p className="mt-1 text-muted-foreground text-sm">Header állapotok, ThemeSwitch</p>
            </div>
            <Link to="/dev" className="text-xs text-muted-foreground hover:text-foreground transition">← Vissza</Link>
          </div>
        </div>

        {/* Tab navigáció */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                active === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/60 border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Preview terület */}
        <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-card/40">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-1">
              {TABS.find(t => t.id === active)?.label}
            </span>
          </div>

          <div className="p-6">
            {active === "header-auth"  && <HeaderLoggedIn username="KovácsPéter" />}
            {active === "header-admin" && <HeaderLoggedIn username="AdminUser" isAdmin />}
            {active === "header-guest" && <HeaderGuest />}
            {active === "mobile-auth"  && (
              <div className="flex justify-center">
                <MobileMenuMock loggedIn />
              </div>
            )}
            {active === "mobile-guest" && (
              <div className="flex justify-center">
                <MobileMenuMock loggedIn={false} />
              </div>
            )}
            {active === "themeswitch" && (
              <div className="flex flex-col items-start gap-4 p-4">
                <p className="text-xs text-muted-foreground">Önálló ThemeSwitch — kattintásra vált (csak a preview-ban, a valódi téma nem változik):</p>
                <ThemeSwitchMock />
                <p className="text-xs text-muted-foreground mt-2">A Header-ben mindig jelen van, a valódi verzió a ThemeProvider context-et használja.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
