import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute("/contact")({
    component: ContactPage,
})

function ContactPage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-background text-foreground">
            {/* Glow háttér */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-44 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_60%)] blur-2xl" />
            </div>

            <div className="mx-auto w-full max-w-4xl px-4 py-12">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Kapcsolat</h1>
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

                    <CardContent className="space-y-6">

                        {/* Név */}
                        <div className="space-y-2">
                            <Label>Név</Label>
                            <Input
                                placeholder="Teljes neved"
                                className="rounded-xl"
                              
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label>Email cím</Label>
                            <Input
                                type="email"
                                placeholder="email@example.com"
                                className="rounded-xl"
                               
                            />
                        </div>

                        {/* Üzenet */}
                        <div className="space-y-2">
                            <Label>Üzenet</Label>
                            <Textarea
                                rows={5}
                                placeholder="Írd ide az üzeneted..."
                                className="rounded-xl h-40"
        
                            />
                        </div>

                        <Button
                            className="w-full rounded-xl"
                        >
                            Üzenet küldése
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
