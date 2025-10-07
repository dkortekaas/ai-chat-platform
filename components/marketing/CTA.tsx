import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-primary py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-5xl">
            Klaar om te beginnen?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Sluit je aan bij honderden bedrijven die hun klantenservice al hebben geautomatiseerd. 
            Start vandaag gratis, geen creditcard vereist.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              variant="secondary"
              className="group w-full sm:w-auto"
              asChild
            >
              <Link href="/signup">
              Start gratis
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Geen creditcard vereist</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Setup in 5 minuten</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Cancel op elk moment</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>
    </section>
  );
};