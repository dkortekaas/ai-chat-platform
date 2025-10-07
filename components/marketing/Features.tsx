import { Zap, Target, Palette, BarChart3, Lock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Snel en eenvoudig",
    description: "Geen maanden implementatie. Van upload tot live in minder dan 5 minuten. Geen technische kennis vereist.",
  },
  {
    icon: Target,
    title: "Altijd accurate antwoorden",
    description: "Antwoorden zijn altijd gebaseerd op uw eigen content. Geen hallucinaties. Elke antwoord toont de gebruikte bronnen.",
  },
  {
    icon: Palette,
    title: "100% op maat",
    description: "Pas kleuren, toon en gedrag volledig aan aan uw merkidentiteit. Van formeel tot speels.",
  },
  {
    icon: BarChart3,
    title: "Volledige controle",
    description: "Zie elk gesprek, beoordeel de kwaliteit van antwoorden en identificeer kennishiaten.",
  },
  {
    icon: Lock,
    title: "Veilig en privé",
    description: "Self-hosted optie beschikbaar. Uw data blijft van u. GDPR-compliant. Enterprise-grade beveiliging.",
  },
  {
    icon: TrendingUp,
    title: "Schaalt mee",
    description: "Van 10 tot 10.000 gesprekken per maand. Onze infrastructuur schaalt automatisch mee met uw groei.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            Waarom kiezen voor ons platform?
          </h2>
          <p className="text-lg text-muted-foreground">
            Alles wat u nodig heeft om uw klantenservice te automatiseren zonder compromissen
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};