import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === "en" ? "中文" : "EN"}
      </span>
    </Button>
  );
};

export default LanguageToggle;
