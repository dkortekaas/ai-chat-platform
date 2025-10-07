"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-bold text-primary-foreground">AI</span>
          </div>
          <span className="text-xl font-bold text-foreground">Cited</span>
        </div>
        
        <nav className="hidden items-center gap-6 md:flex">
          <button 
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('features')}
          </button>
          <button 
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('pricing')}
          </button>
          <button 
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('faq')}
          </button>
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${locale}/login`}>
              {t('login')}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/${locale}/signup`}>
              {t('signup')}
            </Link>
          </Button>
        </nav>
        
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <button 
              onClick={() => scrollToSection("features")}
              className="text-left text-sm font-medium text-muted-foreground"
            >
              {t('features')}
            </button>
            <button 
              onClick={() => scrollToSection("pricing")}
              className="text-left text-sm font-medium text-muted-foreground"
            >
              {t('pricing')}
            </button>
            <button 
              onClick={() => scrollToSection("faq")}
              className="text-left text-sm font-medium text-muted-foreground"
            >
              {t('faq')}
            </button>
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
            <Button asChild variant="ghost" className="w-full">
              <Link href={`/${locale}/login`}>
                {t('login')}
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href={`/${locale}/signup`}>
                {t('signup')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};