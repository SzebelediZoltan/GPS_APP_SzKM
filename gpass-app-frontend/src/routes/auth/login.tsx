import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

const loginUser = (userData: LoginValues) => {
  return axios.post("/api/auth/login", userData, { withCredentials: true })
}

// ===== ROUTE =====
export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
})

// ===== ZOD =====
// userID: min 8
// password: min 8
const LoginSchema = z.object({
  userID: z
    .string()
    .min(8, "A felhasználónév legalább 8 karakter.")
    .nonempty("A felhasználónév kötelező."),
  password: z
    .string()
    .min(8, "A jelszó legalább 8 karakter.")
    .nonempty("A jelszó kötelező."),
})


type LoginValues = z.infer<typeof LoginSchema>

function LoginPage() {

  const nav = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) nav({ to: "/" })
  }, [user, nav])


  const queryClient = useQueryClient()

  const { mutate: login } = useMutation<unknown, AxiosError<{ message: string }>, LoginValues>({
    mutationFn: (userData: LoginValues) => loginUser(userData),
    mutationKey: ["user"],
    onSuccess: () => {
      toast.success("Sikeres bejelentkezés!", {
        position: "bottom-right"
      })
      queryClient.invalidateQueries({ queryKey: ["user"] }),
        nav({ to: "/" })
    },
    onError(error) {
      toast.error(error.response?.data.message)
    },
  })

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userID: "",
      password: "",
    },
    mode: "onTouched",
  })

  function onSubmit(values: LoginValues) {
    login(values)
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground">

      {/* background glow, illeszkedik a landinghez */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-48 -right-30 h-130 w-130 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--ring)/0.20),transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Főoldal
          </Button>
        </Link>
        {/* Logo + Brand (header nélkül, középen) */}
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
            Jelentkezz be a fiókodba a folytatáshoz.
          </p>
        </div>

        <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
          <div className="absolute right-4 top-4">
            <ThemeSwitch />
          </div>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Bejelentkezés</CardTitle>
            <CardDescription>
              Add meg a felhasználóneved és jelszavad.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="userID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Felhasználónév vagy E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="pl. csabika66"
                          autoComplete="username"
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
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Bejelentkezés
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1 bg-border/70" />
                  <span className="text-xs text-muted-foreground">vagy</span>
                  <Separator className="flex-1 bg-border/70" />
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Nincs még fiókod?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Regisztrálj
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          A bejelentkezéssel elfogadod az alkalmazás alapvető működését és szabályait.
        </p>
      </div>
    </main>
  )
}
