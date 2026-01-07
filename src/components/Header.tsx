import { Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import binanceLifeLogo from "@/assets/binance-life-logo.png";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { t } = useLanguage();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src={binanceLifeLogo} 
            alt="币安人生" 
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg">{t("header.title")}</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a 
            href="https://x.com/0xOliviaPp" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 rounded-full hover:bg-muted transition-colors duration-200 group" 
            aria-label="Follow on Twitter"
          >
            <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
