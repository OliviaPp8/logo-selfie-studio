import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for fun
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Conditions
            </Link>
            <p>
              © {new Date().getFullYear()} BinanceLife. All company logos belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
