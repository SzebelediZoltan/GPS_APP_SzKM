import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

export const Route = createFileRoute("/contact")({
  component: ContactPage,
})

/* ================= API FUNCTION ================= */

type ContactPayload = {
  name: string
  email: string
  message: string
}

const sendContactMessage = (data: ContactPayload) => {
  return axios.post("/api/contact", data, {
    withCredentials: true
  })
}


/* ================= ZOD SCHEMA ================= */

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "A név legalább 2 karakter legyen."),
  email: z
    .email("Érvényes email címet adj meg."),
  message: z
    .string()
    .min(10, "Az üzenet legalább 10 karakter legyen."),
})

type ContactFormValues = z.infer<typeof contactSchema>

/* ================= COMPONENT ================= */

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

  const { mutate, isPending } = useMutation<unknown, AxiosError<{ message: string }>, ContactFormValues>({
    mutationFn: sendContactMessage,
    onMutate: () => {
      toast.loading("Üzenet küldése...", { id: "contact" })
    },
    onSuccess: () => {
      toast.success("Üzenet sikeresen elküldve!", { id: "contact" })
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data.message, {
        id: "contact",
      })
    },
  })

  const onSubmit = (data: ContactFormValues) => {
    mutate(data)
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Kapcsolat
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kérdésed van? Írj nekünk és hamarosan válaszolunk.
          </p>
        </div>

        <Card className="rounded-2xl border-border/60 bg-card/60 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle>Üzenet küldése</CardTitle>
            <CardDescription>
              Töltsd ki az alábbi űrlapot.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {/* NAME */}
              <div className="space-y-2">
                <Label>Név</Label>
                <Input
                  {...register("name")}
                  placeholder="Teljes neved"
                  className="rounded-xl"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email cím</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="email@example.com"
                  className="rounded-xl"
                  disabled={!!user}
                />
                {user && (
                  <p className="text-xs text-muted-foreground">
                    A bejelentkezett email címed kerül felhasználásra.
                  </p>
                )}
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <Label>Üzenet</Label>
                <Textarea
                  {...register("message")}
                  placeholder="Írd ide az üzeneted..."
                  className="rounded-xl h-40"
                />
                {errors.message && (
                  <p className="text-sm text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? "Küldés..." : "Üzenet küldése"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}