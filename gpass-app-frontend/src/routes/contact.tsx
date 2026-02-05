import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/contact")({
    component: ContactPage,
})

function ContactPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="mb-6 space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Kapcsolat</h1>
                <p className="text-muted-foreground">
                    Írj nekünk, ha kérdésed van vagy visszajelzést küldenél.
                </p>
            </div>

            <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
                <CardHeader>
                    <CardTitle>Elérhetőségek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="space-y-1">
                        <div className="text-foreground font-medium">Email</div>
                        <div>gpass.geolocate@gmail.com</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-foreground font-medium">Telefon</div>
                        <div>+36 70 904 8601</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-foreground font-medium">Üzenet</div>
                        <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                            Mit szeretnél nekünk üzenni?
                        </div>
                    </div>

                    <Button>Üzenet küldése</Button>
                </CardContent>
            </Card>
        </div>
    )
}
