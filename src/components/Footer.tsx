import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for fun
          </p>
          <p>
            © {new Date().getFullYear()} LogoPhoto. All company logos belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
