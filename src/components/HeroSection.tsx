import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const HeroSection = () => {
  const {
    t
  } = useLanguage();
  return <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{t("hero.badge")}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up animation-delay-100">
          {t("hero.title1")}
          <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 bg-clip-text text-transparent">{t("hero.title2")}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-200">
          {t("hero.description")}
        </p>
      </div>
    </section>;
};
export default HeroSection;