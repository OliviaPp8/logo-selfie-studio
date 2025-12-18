import { Twitter } from "lucide-react";
const Header = () => {
  return <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LP</span>
          </div>
          <span className="font-semibold text-lg">币安人生BinanceLife</span>
        </div>
        
        <a href="https://x.com/0xOliviaPp" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors duration-200 group" aria-label="Follow on Twitter">
          <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      </div>
    </header>;
};
export default Header;