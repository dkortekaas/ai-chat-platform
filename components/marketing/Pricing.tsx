import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Gratis",
    description: "Voor kleine websites en testen",
    features: [
      "50 gesprekken per maand",
      "5 documenten (max 5MB)",
      "1 website",
      "Basis aanpassingen",
      "Email support (48u)",
    ],
    limitations: [
      "Geen API toegang",
      "Geen data export",
      "'Powered by' branding",
    ],
    cta: "Start gratis",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "€49",
    period: "/maand",
    description: "Voor groeiende bedrijven",
    features: [
      "1.000 gesprekken per maand",
      "50 documenten (max 10MB)",
      "3 websites",
      "Volledige UI aanpassingen",
      "Verwijder branding",
      "Prioriteit support (24u)",
      "Basis analytics dashboard",
      "Conversatie export (CSV)",
    ],
    cta: "Start nu",
    highlighted: true,
  },
  {
    name: "Business",
    price: "€149",
    period: "/maand",
    description: "Voor professionele organisaties",
    features: [
      "5.000 gesprekken per maand",
      "Onbeperkt documenten",
      "10 websites",
      "API toegang",
      "Advanced analytics",
      "Custom domein",
      "Prioriteit chat support (4u)",
      "Team accounts (5 gebruikers)",
      "Webhook integraties",
    ],
    cta: "Start nu",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Voor grote organisaties",
    features: [
      "Onbeperkt gesprekken",
      "Onbeperkt documenten",
      "Self-hosted optie",
      "SLA garantie (99.9% uptime)",
      "24/7 prioriteit support",
      "Dedicated account manager",
      "SSO / SAML authenticatie",
      "Custom integraties",
    ],
    cta: "Neem contact op",
    highlighted: false,
  },
];

export const Pricing = () => {
  return (
    <section className="bg-muted/50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            Transparante prijzen voor elke schaalgrootte
          </h2>
          <p className="text-lg text-muted-foreground">
            Begin gratis en upgrade wanneer u wilt. Geen verborgen kosten.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative flex flex-col ${
                plan.highlighted 
                  ? "border-accent shadow-accent" 
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
                  Meest populair
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, limitIndex) => (
                    <li key={limitIndex} className="flex items-start gap-2 opacity-60">
                      <span className="mt-0.5 text-sm">❌</span>
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="mt-6 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            🎉 Eerste 100 klanten krijgen 50% korting eerste 3 maanden + Lifetime 20% korting
          </p>
        </div>
      </div>
    </section>
  );
};