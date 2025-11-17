import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createFileRoute } from '@tanstack/react-router'
import Header from "@/components/header"

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen bg-linear-to-br from-blue-50 to-slate-100">
    <Header/>
    <div className="flex justify-center py-16 px-4">
      <Card className="max-w-xl w-full shadow-lg">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            Write us if you want - We will reach back soon
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Add meg a neved" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Írd ide az üzeneted..." className="min-h-[140px]" />
            </div>

            <Button type="submit" className="w-full">
              Küldés
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
