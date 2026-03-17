import { createFileRoute } from "@tanstack/react-router"
import {
  User,
  Lock,
  Map,
  Users,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  UsersRound,
  Ban,
  Gauge,
  TriangleAlert,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/profile/useSettings"
import NotLoggedIn from "@/components/shared/NotLoggedIn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ── Route ──

export const Route = createFileRoute("/profile/settings")({
  component: SettingsPage,
})

// ── Szekciók definíciója ──

type SectionKey = "profile" | "password" | "map" | "privacy"

const SECTIONS: { key: SectionKey; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    key: "profile",
    label: "Profil",
    icon: <User className="h-4 w-4" />,
    desc: "Név, email, státusz",
  },
  {
    key: "password",
    label: "Jelszó",
    icon: <Lock className="h-4 w-4" />,
    desc: "Jelszó megváltoztatása",
  },
  {
    key: "map",
    label: "Térkép",
    icon: <Map className="h-4 w-4" />,
    desc: "AI, megjelenítés, barát szűrő",
  },
  {
    key: "privacy",
    label: "Adatvédelem",
    icon: <Shield className="h-4 w-4" />,
    desc: "Ki láthatja a pozíciódat",
  },
]

// ── Zod sémák ──

const ProfileSchema = z.object({
  username: z.string().min(3, "Legalább 3 karakter szükséges.").max(40, "Maximum 40 karakter."),
  email: z.string().email("Érvényes email cím szükséges."),
  status: z.string().max(100, "Maximum 100 karakter.").nullable().optional(),
})

const PasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Legalább 8 karakter szükséges.")
      .regex(/[A-Z]/, "Legalább egy nagybetű szükséges.")
      .regex(/[0-9]/, "Legalább egy szám szükséges."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "A két jelszó nem egyezik.",
    path: ["confirmPassword"],
  })

type ProfileValues = z.infer<typeof ProfileSchema>
type PasswordValues = z.infer<typeof PasswordSchema>

// ── Térkép beállítások localStorage kulcsai ──

const MAP_SETTINGS_KEY = "gpass_map_settings"

type MapSettings = {
  aiEnabled: boolean
  visibleUsers: "all" | "friends" | "clan" | "none"
  showSpeedLimit: boolean
  showMarkers: boolean
}

const DEFAULT_MAP_SETTINGS: MapSettings = {
  aiEnabled: true,
  visibleUsers: "all",
  showSpeedLimit: true,
  showMarkers: true,
}

function loadMapSettings(): MapSettings {
  try {
    const raw = localStorage.getItem(MAP_SETTINGS_KEY)
    if (!raw) return DEFAULT_MAP_SETTINGS
    return { ...DEFAULT_MAP_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_MAP_SETTINGS
  }
}

function saveMapSettings(s: MapSettings) {
  localStorage.setItem(MAP_SETTINGS_KEY, JSON.stringify(s))
}

// ── Fő oldal ──

function SettingsPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<SectionKey>("profile")

  if (!user) return <NotLoggedIn />

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">

        {/* Fejléc */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-3">
            <User className="h-3.5 w-3.5" />
            Beállítások
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Fiókbeállítások</h1>
          <p className="text-muted-foreground mt-1 text-sm">Kezeld a profilodat, biztonságodat és térképes preferenciáidat.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Bal nav */}
          <nav className="md:w-56 shrink-0">
            <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden">
              {SECTIONS.map((s, i) => (
                <div key={s.key}>
                  <button
                    onClick={() => setActiveSection(s.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
                      activeSection === s.key
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 transition-colors",
                      activeSection === s.key
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border/60 bg-background/40 text-muted-foreground"
                    )}>
                      {s.icon}
                    </span>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", activeSection === s.key ? "text-primary" : "text-foreground")}>
                        {s.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{s.desc}</p>
                    </div>
                    {activeSection === s.key && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary shrink-0" />
                    )}
                  </button>
                  {i < SECTIONS.length - 1 && <Separator className="bg-border/40" />}
                </div>
              ))}
            </div>
          </nav>

          {/* Tartalom */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-border/60 bg-card/60 shadow-xl backdrop-blur p-6">
              {activeSection === "profile" && <ProfileSection user={user} />}
              {activeSection === "password" && <PasswordSection user={user} />}
              {activeSection === "map" && <MapSection />}
              {activeSection === "privacy" && <PrivacySection />}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

// ══════════════════════════════════════════
// PROFIL SZEKCIÓ
// ══════════════════════════════════════════

function ProfileSection({ user }: { user: { userID: string; username: string; email: string; isAdmin: boolean } }) {
  const { updateProfile, isProfileSaving } = useSettings()

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      status: "",
    },
  })

  useEffect(() => {
    form.reset({ username: user.username, email: user.email, status: "" })
  }, [user.username, user.email])

  const onSubmit = (values: ProfileValues) => {
    updateProfile({
      userID: user.userID,
      username: values.username,
      email: values.email,
      status: values.status ?? null,
      isAdmin: user.isAdmin,
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<User className="h-5 w-5" />}
        title="Profil adatok"
        desc="A megjelenített neved, email címed és státuszod."
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Avatar placeholder */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background/40">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-black text-primary">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.isAdmin && (
              <Badge className="mt-1 rounded-full text-[10px] px-1.5">
                <Shield className="h-2.5 w-2.5 mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>

        <FieldRow label="Felhasználónév" error={form.formState.errors.username?.message}>
          <Input className="rounded-xl" {...form.register("username")} placeholder="pl. CoolUser42" />
        </FieldRow>

        <FieldRow label="Email cím" error={form.formState.errors.email?.message}>
          <Input className="rounded-xl" type="email" {...form.register("email")} placeholder="pelda@email.com" />
        </FieldRow>

        <FieldRow label="Státusz" hint="Egy rövid mondat ami megjelenik a profilodon." error={form.formState.errors.status?.message}>
          <Input className="rounded-xl" {...form.register("status")} placeholder='pl. "Mindig úton..."' />
        </FieldRow>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isProfileSaving} className="rounded-xl cursor-pointer gap-2">
            <Save className="h-4 w-4" />
            {isProfileSaving ? "Mentés..." : "Mentés"}
          </Button>
        </div>

      </form>
    </div>
  )
}

// ══════════════════════════════════════════
// JELSZÓ SZEKCIÓ
// ══════════════════════════════════════════

function PasswordSection({ user }: { user: { userID: string; username: string; email: string; isAdmin: boolean } }) {
  const { updatePassword, isPasswordSaving } = useSettings()
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmit = (values: PasswordValues) => {
    updatePassword({
      userID: user.userID,
      username: user.username,
      email: user.email,
      password: values.newPassword,
      isAdmin: user.isAdmin,
    })
    form.reset()
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Lock className="h-5 w-5" />}
        title="Jelszó megváltoztatása"
        desc="Legalább 8 karakter, egy nagybetű és egy szám szükséges."
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        <FieldRow label="Új jelszó" error={form.formState.errors.newPassword?.message}>
          <div className="relative">
            <Input
              className="rounded-xl pr-10"
              type={showNew ? "text" : "password"}
              {...form.register("newPassword")}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FieldRow>

        <FieldRow label="Jelszó megerősítése" error={form.formState.errors.confirmPassword?.message}>
          <div className="relative">
            <Input
              className="rounded-xl pr-10"
              type={showConfirm ? "text" : "password"}
              {...form.register("confirmPassword")}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FieldRow>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPasswordSaving} className="rounded-xl cursor-pointer gap-2">
            <Lock className="h-4 w-4" />
            {isPasswordSaving ? "Mentés..." : "Jelszó megváltoztatása"}
          </Button>
        </div>

      </form>
    </div>
  )
}

// ══════════════════════════════════════════
// TÉRKÉP SZEKCIÓ
// ══════════════════════════════════════════

const VISIBLE_USERS_OPTIONS: {
  value: MapSettings["visibleUsers"]
  label: string
  desc: string
  icon: React.ReactNode
}[] = [
  {
    value: "all",
    label: "Mindenki",
    desc: "Barátok és klántagok is látszanak",
    icon: <UsersRound className="h-4 w-4" />,
  },
  {
    value: "friends",
    label: "Csak barátok",
    desc: "Klántagok nem látszanak",
    icon: <UserCheck className="h-4 w-4" />,
  },
  {
    value: "clan",
    label: "Csak klántag",
    desc: "Barátok nem látszanak",
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: "none",
    label: "Senki",
    desc: "Senki sem látszik a térképen",
    icon: <Ban className="h-4 w-4" />,
  },
]

function MapSection() {
  const [settings, setSettings] = useState<MapSettings>(loadMapSettings)

  const update = (patch: Partial<MapSettings>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveMapSettings(next)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Map className="h-5 w-5" />}
        title="Térkép beállítások"
        desc="Testreszabhatod, mi jelenjen meg a térképen menetközben."
      />

      {/* AI funkció */}
      <SettingGroup title="AI asszisztens">
        <SwitchRow
          label="AI funkció engedélyezése"
          desc="Az AI gomb megjelenik a térképen — kérdezhetd az útvonalról, forgalomról."
          icon={<Sparkles className="h-4 w-4" />}
          checked={settings.aiEnabled}
          onCheckedChange={(v) => update({ aiEnabled: v })}
        />
      </SettingGroup>

      {/* Térkép elemek */}
      <SettingGroup title="Megjelenítés">
        <SwitchRow
          label="Sebességkorlátozás mutatása"
          desc="Valós idejű sebességhatár megjelenítése menetközben."
          icon={<Gauge className="h-4 w-4" />}
          checked={settings.showSpeedLimit}
          onCheckedChange={(v) => update({ showSpeedLimit: v })}
        />
        <Separator className="bg-border/40" />
        <SwitchRow
          label="Közösségi markerek mutatása"
          desc="Rendőr, baleset, útlezárás stb. jelzések a térképen."
          icon={<TriangleAlert className="h-4 w-4" />}
          checked={settings.showMarkers}
          onCheckedChange={(v) => update({ showMarkers: v })}
        />
      </SettingGroup>

      {/* Barát szűrő */}
      <SettingGroup title="Online felhasználók szűrése" noCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VISIBLE_USERS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ visibleUsers: opt.value })}
              className={cn(
                "flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all cursor-pointer",
                settings.visibleUsers === opt.value
                  ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/10"
                  : "border-border/60 bg-background/40 hover:bg-accent"
              )}
            >
              <span className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl border shrink-0",
                settings.visibleUsers === opt.value
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border/60 bg-background/60 text-muted-foreground"
              )}>
                {opt.icon}
              </span>
              <div className="min-w-0">
                <p className={cn("text-sm font-semibold leading-tight", settings.visibleUsers === opt.value ? "text-primary" : "text-foreground")}>{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </SettingGroup>

    </div>
  )
}

// ══════════════════════════════════════════
// ADATVÉDELEM SZEKCIÓ
// ══════════════════════════════════════════

const PRIVACY_SETTINGS_KEY = "gpass_privacy_settings"

type PrivacySettings = {
  shareLocation: boolean
}

const DEFAULT_PRIVACY: PrivacySettings = { shareLocation: true }

function loadPrivacy(): PrivacySettings {
  try {
    const raw = localStorage.getItem(PRIVACY_SETTINGS_KEY)
    return raw ? { ...DEFAULT_PRIVACY, ...JSON.parse(raw) } : DEFAULT_PRIVACY
  } catch { return DEFAULT_PRIVACY }
}

function PrivacySection() {
  const [privacy, setPrivacy] = useState<PrivacySettings>(loadPrivacy)

  const update = (patch: Partial<PrivacySettings>) => {
    const next = { ...privacy, ...patch }
    setPrivacy(next)
    localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(next))
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Shield className="h-5 w-5" />}
        title="Adatvédelem"
        desc="Szabályozd, hogy mások láthatják-e a pozíciódat valós időben."
      />

      <SettingGroup title="Pozíció megosztás">
        <SwitchRow
          label="Valós idejű pozíció megosztása"
          desc="Ha be van kapcsolva, a barátaid és klántagjaid látják hol vagy a térképen."
          icon={<Users className="h-4 w-4" />}
          checked={privacy.shareLocation}
          onCheckedChange={(v) => update({ shareLocation: v })}
        />
      </SettingGroup>

      <div className="rounded-xl border border-border/60 bg-background/40 p-4 flex gap-3">
        <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          A GPASS nem osztja meg adataidat harmadik felekkel. A pozícióadat csak aktív munkamenet alatt kerül tárolásra, és csak a barátaid / klántagjaid számára látható.
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
// ÚJRAFELHASZNÁLHATÓ KISEBB KOMPONENSEK
// ══════════════════════════════════════════

function SectionHeader({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border/50">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl border border-border/60 bg-background/40 text-muted-foreground shrink-0 mt-0.5">
        {icon}
      </span>
      <div>
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function SettingGroup({ title, children, noCard }: { title: string; children: React.ReactNode; noCard?: boolean }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">{title}</p>
        <div className="flex-1 h-px bg-border/50" />
      </div>
      {noCard ? children : (
        <div className="rounded-xl border border-border/60 bg-background/40 overflow-hidden divide-y divide-border/40">
          {children}
        </div>
      )}
    </div>
  )
}

function SwitchRow({
  label,
  desc,
  icon,
  checked,
  onCheckedChange,
}: {
  label: string
  desc: string
  icon: React.ReactNode
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-border/60 bg-background/60 text-muted-foreground shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground leading-snug mt-0.5">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0" />
    </div>
  )
}

function FieldRow({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
