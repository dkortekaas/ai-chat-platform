import { Upload, Brain, Code, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload uw content",
    description: "Sleep PDF's, Word-documenten of voeg URLs toe. Ondersteunt handleidingen, FAQ's, productinfo, beleidsdocumenten en meer.",
  },
  {
    icon: Brain,
    number: "02",
    title: "AI leert van uw content",
    description: "Onze geavanceerde AI-technologie (GPT-4) verwerkt uw documenten en leert de context, nuances en belangrijke informatie kennen.",
  },
  {
    icon: Code,
    number: "03",
    title: "Integreer in 1 minuut",
    description: "Kopieer één regel code en plak deze in uw website. De chatbot is direct live en begint met het beantwoorden van vragen.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Verbeter continu",
    description: "Bekijk alle gestelde vragen, beoordeel antwoorden en verfijn uw kennisbank voor steeds betere resultaten.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="bg-muted/50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            Hoe het werkt
          </h2>
          <p className="text-lg text-muted-foreground">
            Van documenten naar intelligente chatbot in 4 eenvoudige stappen
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-primary">
                    <step.icon className="h-8 w-8" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mt-4 h-full w-px bg-gradient-to-b from-accent to-transparent" />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="mb-2 text-sm font-bold text-accent">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};