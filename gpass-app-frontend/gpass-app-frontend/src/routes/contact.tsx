import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { Mail, MessageSquare, Clock, Shield } from "lucide-react"

export const Route = createFileRoute("/contact")({
  component: ContactPage,
})

/* ─── API ─── */
type ContactPayload = { name: string; email: string; message: string }
const sendContactMessage = (data: ContactPayload) =>
  axios.post("/api/contact", data, { withCredentials: true })

/* ─── Schema ─── */
const contactSchema = z.object({
  name: z.string().min(2, "A név legalább 2 karakter legyen."),
  email: z.email("Érvényes email címet adj meg."),
  message: z.string().min(10, "Az üzenet legalább 10 karakter legyen."),
})
type ContactFormValues = z.infer<typeof contactSchema>

/* ─── Info items bal oldal ─── */
const infoItems = [
  {
    icon: <Clock className="h-5 w-5 text-primary" />,
    title: "Gyors válasz",
    desc: "Általában 1–2 munkanapon belül válaszolunk.",
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    title: "Biztonságos",
    desc: "Az adataidat csak a kapcsolatfelvételhez használjuk.",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    title: "Bármilyen kérdés",
    desc: "Legyen szó hibáról, javaslatról vagy együttműködésről.",
  },
]

/* ─── Component ─── */
function ContactPage() {
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.username ?? "",
        email: user.email ?? "",
        message: "",
      })
    }
  }, [user, reset])

  const { mutate, isPending } = useMutation<
    unknown,
    AxiosError<{ message: string }>,
    ContactFormValues
  >({
    mutationFn: sendContactMessage,
    onMutate: () => {
      toast.loading("Üzenet küldése...", { id: "contact" })
    },
    onSuccess: () => {
      toast.success("Üzenet sikeresen elküldve!", { id: "contact" })
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data.message, { id: "contact" })
    },
  })

  const onSubmit = (data: ContactFormValues) => mutate(data)

  return (
    <main className="relative min-h-[calc(100vh-64px)] bg-background text-foreground overflow-hidden">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{ backgroundImage: `linear-gradient(hsl(var(--foreground)/0.025) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.025) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-100 w-150"
          style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)/0.1) 0%, transparent 65%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10">

        {/* Header */}
        <div className="mb-10 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Kapcsolat</span>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl leading-none">
            Írj nekünk
          </h1>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">
            Kérdésed van? Hibát találtál? Bármilyen visszajelzést szívesen fogadunk.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] items-start">

          {/* ── Bal: Info panel ── */}
          <div className="space-y-4 lg:sticky lg:top-28">
            {infoItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur transition-colors duration-200 hover:border-primary/25"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/70">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Email direct */}
            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/70">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Közvetlen email</p>
                <p className="mt-0.5 text-xs text-muted-foreground">support@gpass.hu</p>
              </div>
            </div>
          </div>

          {/* ── Jobb: Form ── */}
          <div
            className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-xl backdrop-blur"
            style={{ boxShadow: "0 0 0 1px hsl(var(--primary)/0.06), 0 20px 40px -10px rgba(0,0,0,0.3)" }}
          >
            {/* Form header sáv */}
            <div className="border-b border-border/40 bg-background/40 px-6 py-4">
              <h2 className="font-bold text-base">Üzenet küldése</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Töltsd ki az alábbi mezőket.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">

              {/* NAME + EMAIL egymás mellett */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Név</Label>
                  <Input
                    {...register("name")}
                    placeholder="Teljes neved"
                    className="rounded-xl bg-background/60 border-border/60 focus:border-primary/50 transition-colors"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email cím</Label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="email@example.com"
                    className="rounded-xl bg-background/60 border-border/60 focus:border-primary/50 transition-colors"
                    disabled={!!user}
                  />
                  {user && (
                    <p className="text-xs text-muted-foreground/60">Bejelentkezve mint {user.username}</p>
                  )}
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* MESSAGE */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Üzenet</Label>
                <Textarea
                  {...register("message")}
                  placeholder="Írd ide az üzeneted..."
                  className="rounded-xl h-32 bg-background/60 border-border/60 focus:border-primary/50 transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border/40" />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 active:scale-[0.98]"
                size="lg"
              >
                <Mail className="mr-2 h-4 w-4" />
                {isPending ? "Küldés..." : "Üzenet küldése"}
              </Button>

            </form>
          </div>

        </div>
      </div>
    </main>
  )
}
