import React from "react"
import { ChevronDown, LogOut, Menu, Settings, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { Link, useNavigate } from "@tanstack/react-router"
import ThemeSwitch from "@/components/ThemeSwitch"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"

type User = {
    userID: string,
    username: string,
    isAdmin: boolean
}

type HeaderProps = {
    user: User | null
}

const logOut = () => {
    return axios.delete("/api/auth/logout", { withCredentials: true })
}

export default function Header({ user }: HeaderProps) {

    const nav = useNavigate()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/70 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                {/* Left: Logo + Brand */}
                <div className="flex items-center">
                    <Link
                        to="/"
                        className="group flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {/* LOGO – keret nélkül, nagyobb */}
                        <img
                            src="/logo.png"
                            alt="GPASS logo"
                            draggable={false}
                            className={[
                                "h-11 w-11 object-contain",
                                "transition-transform duration-300",
                                "group-hover:scale-110 group-hover:-rotate-6",
                            ].join(" ")}
                        />

                        {/* BRAND TEXT */}
                        <div className="leading-none">
                            <div
                                className={[
                                    "text-lg font-bold tracking-tight",
                                    "bg-linear-to-r from-primary via-sky-500 to-indigo-500",
                                    "bg-clip-text text-transparent",
                                    "transition-all duration-300",
                                    "group-hover:brightness-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.35)] mr-2",
                                ].join(" ")}
                            >
                                GPASS
                            </div>
                        </div>
                    </Link>
                </div>


                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-1 md:flex">
                        <ThemeSwitch />
                        <NavLink label="Térkép" to="/map" />
                        <NavLink label="Rólunk" to="/about" />
                        <NavLink label="Kapcsolat" to="/contact" />
                        <NavLink label="Klánok" to="/clans" />
                    </nav>

                    <Separator orientation="vertical" className="hidden h-8 md:block" />

                    {/* Desktop user dropdown */}
                    {user ? (
                        <div className="hidden md:block">
                            <UserDropdown username={user.username} />
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="rounded-xl hidden md:block"
                            onClick={() => nav({ to: "/auth/login" })}
                        >
                            Bejelentkezés
                        </Button>
                    )}

                    {/* Mobile: hamburger (Sheet) */}
                    <div className="md:hidden">
                        <MobileMenu user={user} />
                    </div>
                </div>
            </div>
        </header>
    )
}

function NavLink({ label, to }: { label: string; to: string }) {
    const base =
        "rounded-xl px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
    const inactive = "text-muted-foreground hover:bg-accent hover:text-foreground"
    const active = "bg-accent text-foreground"

    return (
        <Link
            to={to}
            className={`${base} ${inactive}`}
            activeProps={{ className: `${base} ${active}` }}
        >
            {label}
        </Link>
    )
}



function UserDropdown({ username }: { username: string }) {

    const nav = useNavigate()
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const userID = user?.userID || ""

    const { mutate: logout } = useMutation({
        mutationFn: logOut,
        onSuccess: () => {
            queryClient.setQueryData(["user"], null),
                nav({
                    to: "/auth/login"
                })
        }
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    aria-label="User menu"
                >
                    <span className="grid h-7 w-7 place-items-center rounded-lg border border-border/70 bg-background/60 text-xs text-muted-foreground">
                        {username.slice(0, 2).toUpperCase()}
                    </span>

                    <span>{username}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                    nav({
                        to: "/profile/$userID",
                        params: { userID: userID },
                    })
                }}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                    nav({
                        to: "/profile/friends"
                    })
                }}>
                    <Users className="mr-2 h-4 w-4" />
                    Barátok
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                    nav({
                        to: "/profile/settings"
                    })
                }}>
                    <Settings className="mr-2 h-4 w-4" />
                    Beállítások
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => { logout() }}
                    className="text-destructive focus:text-destructive cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Kijelentkezés
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

function MobileMenu({ user }: { user: User | null }) {

    const nav = useNavigate()
    const queryClient = useQueryClient()
    const { mutate: logout } = useMutation({
        mutationFn: logOut,
        onSuccess: () => {
            queryClient.setQueryData(["user"], null),
                nav({
                    to: "/auth/login"
                })
        }
    })

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>

            {/* Compact sheet */}
            <SheetContent
                side="right"
                className="w-75 sm:w-85 p-0"
            >
                <ThemeSwitch className="absolute left-2 bottom-2" />
                {/* Top bar (minimal) */}
                <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* avatar/név rész */}
                            <div className="grid h-9 w-9 place-items-center rounded-xl border border-border/70 bg-card/60 text-xs font-semibold">
                                {user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm font-semibold">{user.username}</div>
                                <div className="text-xs text-muted-foreground">Fiók</div>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => nav({ to: "/auth/login" })}
                        >
                            Bejelentkezés
                        </Button>
                    )}
                </div>

                <div className="px-4 space-y-5">
                    {/* ACCOUNT */}
                    {user ? (
                        <div className="space-y-2">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Fiók
                            </p>

                            <div className="rounded-xl border border-border/70 bg-card/30">
                                <MobileActionItem
                                    icon={<User className="h-4 w-4" />}
                                    label="Profil"
                                    onClick={() =>
                                        nav({
                                            to: "/profile/$userID",
                                            params: { userID: user.userID },
                                        })
                                    }
                                />
                                <MobileActionItem
                                    icon={<Users className="h-4 w-4" />}
                                    label="Barátok"
                                    onClick={() =>
                                        nav({
                                            to: "/profile/friends",
                                        })
                                    }
                                />
                                <MobileActionItem
                                    icon={<Settings className="h-4 w-4" />}
                                    label="Beállítások"
                                    onClick={() =>
                                        nav({
                                            to: "/profile/settings",
                                        })
                                    }
                                />
                                <MobileActionItem
                                    icon={<LogOut className="h-4 w-4" />}
                                    label="Kijelentkezés"
                                    danger
                                    last
                                    onClick={() => logout()}
                                />
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    {/* NAV */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Navigáció
                        </p>

                        <div className="rounded-xl border border-border/70 bg-card/30 overflow-hidden">
                            <div className="rounded-xl border border-border/70 bg-card/30 overflow-hidden">
                                <SheetClose asChild>
                                    <MobileNavItem label="Térkép" to="/map" />
                                </SheetClose>

                                <SheetClose asChild>
                                    <MobileNavItem label="Rólunk" to="/about" />
                                </SheetClose>

                                <SheetClose asChild>
                                    <MobileNavItem label="Kapcsolat" to="/contact" />
                                </SheetClose>

                                <SheetClose asChild>
                                    <MobileNavItem label="Klánok" to="/clans" last />
                                </SheetClose>
                            </div>

                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    )
}

function MobileNavItem({
    label,
    to,
    last,
}: {
    label: string
    to: string
    last?: boolean
}) {
    const base =
        "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
    const inactive = "text-foreground/90 hover:text-foreground hover:bg-accent/60"
    const active = "bg-accent text-foreground"

    return (
        <SheetClose asChild>
            <Link
                to={to}
                className={[
                    base,
                    inactive,
                    !last ? "border-b border-border/60" : "",
                ].join(" ")}
                activeProps={{
                    className: [base, active, !last ? "border-b border-border/60" : ""].join(" "),
                }}
            >
                {label}
            </Link>
        </SheetClose>
    )
}


function MobileActionItem({
    icon,
    label,
    danger,
    last,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    danger?: boolean
    last?: boolean
    onClick?: () => void
}) {
    return (
        <button
            className={[
                "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium",
                "hover:bg-accent/60 transition",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                !last ? "border-b border-border/60" : "",
                danger ? "text-destructive hover:text-destructive" : "text-foreground",
            ].join(" ")}
            type="button"
            onClick={onClick}
        >
            <span className={danger ? "text-destructive" : "text-muted-foreground"}>
                {icon}
            </span>
            {label}
        </button>
    )
}

