import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            {t("footer.madeWith")} <Heart className="w-4 h-4 text-primary fill-primary" /> {t("footer.forFun")}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">
              {t("footer.terms")}
            </Link>
            <p>
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
