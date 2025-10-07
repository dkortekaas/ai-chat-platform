export const Footer = () => {
    return (
      <footer className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <span className="text-sm font-bold text-primary-foreground">AI</span>
                </div>
                <span className="font-bold text-foreground">Cited</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transformeer uw kennisbank in een intelligente AI-assistent.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Prijzen</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Bedrijf</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Voorwaarden</a></li>
                <li><a href="#" className="hover:text-foreground">GDPR</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Cited. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    );
  };