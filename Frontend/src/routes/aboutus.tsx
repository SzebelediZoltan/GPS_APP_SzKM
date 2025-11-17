import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Header from '@/components/header'


export const Route = createFileRoute('/aboutus')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
        <Header/>
        <div className="w-full flex items-center justify-center bg-muted/40 py-16 px-4 bg-linear-to-br from-blue-50 to-slate-100">
            <Card className="max-w-3xl w-full shadow-xl transition hover:shadow-2xl hover:-translate-y-1 p-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-foreground mb-2">About Us</CardTitle>
                    <CardDescription>
                        Precision. Reliability. Navigation reimagined.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Who We Are</h2>
                        <p>
                            We are a team of passionate engineers, designers, and innovators dedicated to
                            shaping the future of location-based technology. Our mission is to empower
                            people to move smarter, safer, and more efficiently through a seamless
                            navigation experience powered by cutting-edge GPS intelligence.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">What We Do</h2>
                        <p>
                            Our GPS application delivers real-time positioning accuracy, intuitive route
                            planning, and advanced tracking features built for both everyday users and
                            professional environments. Whether you're exploring a new city, managing fleet
                            logistics, or simply trying to get somewhere faster, our technology ensures you
                            stay on the right path—every time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Our Vision</h2>
                        <p>
                            We believe that navigation should be effortless. Our vision is to create an
                            interconnected world where location data works harmoniously with human
                            mobility—enhancing safety, reducing stress, and redefining how people move in
                            their daily lives.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Why Choose Us</h2>
                        <p>
                            With a focus on accuracy, simplicity, and trust, we continuously refine our
                            platform to provide the most reliable GPS experience possible. Our commitment
                            to innovation ensures that our app grows alongside the evolving needs of modern
                            navigation.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
        </>
    )
}
