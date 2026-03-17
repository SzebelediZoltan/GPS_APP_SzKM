import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

/* ================= ZOD ================= */

const CreateClanSchema = z.object({
  name: z
    .string()
    .min(3, "A név legalább 3 karakter.")
    .max(40, "Maximum 40 karakter."),
  description: z
    .string()
    .min(10, "A leírás legalább 10 karakter.")
    .max(200, "Maximum 200 karakter."),
})

type CreateClanValues = z.infer<typeof CreateClanSchema>

/* ================= COMPONENT ================= */

export function CreateClanDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<CreateClanValues>({
    resolver: zodResolver(CreateClanSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onTouched",
  })

  function onSubmit(values: CreateClanValues) {
    // UI-only – itt majd később jön az API
    console.log("Clan created:", values)

    toast.success("Klán sikeresen létrehozva!", {
      position: "bottom-right",
    })

    form.reset()
    setOpen(false) // 🔥 csak siker után zár
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Klán létrehozása
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Új klán létrehozása</DialogTitle>
          <DialogDescription>
            Add meg a klán nevét és leírását.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klán neve</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="pl. Night Riders"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leírás</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Rövid leírás a klánról..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full rounded-xl">
              Létrehozás
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}