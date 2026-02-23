import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import ThemeSwitch from "@/components/ThemeSwitch"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const registerUser = (userData: RegisterValues) => {
    return axios.post("/api/users", userData)
}

// ===== ROUTE =====
export const Route = createFileRoute("/auth/register")({
    component: RegisterPage,
})

// ===== ZOD SCHEMA =====
const RegisterSchema = z.object({
    username: z
        .string()
        .min(8, "A felhasználónév legalább 8 karakter.")
        .nonempty("A felhasználónév kötelező."),
    email: z
        .email("Érvényes email címet adj meg.")
        .nonempty("Az email cím kötelező."),
    password: z
        .string()
        .min(8, "A jelszó legalább 8 karakter.")
        .regex(/[a-z]/, "A jelszó tartalmazzon kisbetűt.")
        .regex(/[A-Z]/, "A jelszó tartalmazzon nagybetűt.")
        .regex(/[0-9]/, "A jelszó tartalmazzon számot.")
        .nonempty("A jelszó kötelező."),
})

type RegisterValues = z.infer<typeof RegisterSchema>

function RegisterPage() {

    const nav = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (user) nav({ to: "/" })
    }, [user, nav])



    const { mutate: create } = useMutation({
        mutationFn: (userData: RegisterValues) => registerUser(userData),
        mutationKey: ["user"],
        onSuccess: () => {
            toast.success("Sikeres regisztráció!", {
                position: "bottom-right"
            })
            nav({
                to: "/auth/login"
            })
        },
        onError: () => {
            toast.error("Sikertelen regisztráció!", {
                position: "bottom-right"
            })
        }
    })

    const form = useForm<RegisterValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    })

    function onSubmit(values: RegisterValues) {
        create(values)
    }

    return (
        <main className="relative min-h-screen bg-background text-foreground">
            <Toaster />
            {/* háttér glow – egységes a login/landing stílussal */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_60%)] blur-2xl" />
                <div className="absolute -bottom-48 -right-30 h-130 w-130 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--ring)/0.20),transparent_60%)] blur-2xl" />
            </div>

            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
                {/* Logo + brand */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex items-center">
                        <img
                            src="/logo.png"
                            alt="GPASS logo"
                            className="h-12 w-12 object-contain transition-transform duration-300 hover:scale-110 hover:-rotate-6"
                            draggable={false}
                        />
                        <div className="leading-none">
                            <div
                                className={cn(
                                    "text-2xl font-bold tracking-tight",
                                    "bg-linear-to-r from-primary via-sky-500 to-indigo-500 bg-clip-text text-transparent"
                                )}
                            >
                                GPASS
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Hozd létre a fiókodat a GPASS használatához.
                    </p>
                </div>

                <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
                    <div className="absolute right-4 top-4">
                        <ThemeSwitch />
                    </div>
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-xl">Regisztráció</CardTitle>
                        <CardDescription>
                            Add meg az adataidat az új fiók létrehozásához.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Felhasználónév</FormLabel>
                                            <FormControl>
                                                <Input placeholder="pl. csabika66" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email cím</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="pl. csabika@gmail.com"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jelszó</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Minimum 8 karakter, kisbetű + nagybetű + szám.
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    Fiók létrehozása
                                </Button>

                                <div className="flex items-center gap-3">
                                    <Separator className="flex-1 bg-border/70" />
                                    <span className="text-xs text-muted-foreground">vagy</span>
                                    <Separator className="flex-1 bg-border/70" />
                                </div>

                                <p className="text-center text-sm text-muted-foreground">
                                    Már van fiókod?{" "}
                                    <Link
                                        to="/auth/login"
                                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                                    >
                                        Jelentkezz be
                                    </Link>
                                </p>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
