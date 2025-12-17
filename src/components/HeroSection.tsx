import { Sparkles } from "lucide-react";
const HeroSection = () => {
  return <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Create fun memories with tech giants</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up animation-delay-100">
          Take a Photo with
          <span className="text-gradient block mt-2">Big Names</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-200">
          Upload your full-body photo and pose next to big names and logos. Perfect for social media, memes, or just for fun!
        </p>
      </div>
    </section>;
};
export default HeroSection;