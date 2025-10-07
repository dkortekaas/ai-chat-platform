import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const faqs = [
    {
      question: "Hoeveel technische kennis heb ik nodig?",
      answer: "Geen. Als u een bestand kunt uploaden en tekst kunt kopiëren en plakken, kunt u onze chatbot implementeren. De interface is volledig intuïtief en vereist geen programmeerkennis.",
    },
    {
      question: "In welke talen werkt de chatbot?",
      answer: "Nederlands, Engels en 50+ andere talen. De chatbot past zich automatisch aan de taal van de gebruiker aan en kan antwoorden in meerdere talen tegelijkertijd.",
    },
    {
      question: "Kan ik de chatbot aanpassen aan mijn huisstijl?",
      answer: "Absoluut. Kleuren, logo, positie, toon en gedrag zijn volledig aanpasbaar zonder code. U kunt de chatbot precies afstemmen op uw merkidentiteit.",
    },
    {
      question: "Wat gebeurt er als de chatbot het antwoord niet weet?",
      answer: "De chatbot geeft eerlijk aan dat het antwoord niet in de kennisbank staat en kan doorverwijzen naar uw support team. Dit voorkomt frustratie en zorgt voor transparantie.",
    },
    {
      question: "Kan ik de chatbot testen voordat ik betaal?",
      answer: "Ja! Start met ons gratis plan (50 gesprekken/maand) en upgrade wanneer u overtuigd bent. Er is geen creditcard vereist om te beginnen.",
    },
    {
      question: "Hoe snel kan ik live gaan?",
      answer: "De gemiddelde setup tijd is minder dan 5 minuten. Upload uw documenten, pas de styling aan en integreer de chatbot met één regel code. Direct live.",
    },
  ];
  
  export const FAQ = () => {
    return (
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
                Veelgestelde vragen
              </h2>
              <p className="text-lg text-muted-foreground">
                Alles wat u moet weten over ons platform
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  };