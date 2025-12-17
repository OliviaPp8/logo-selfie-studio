import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MainEditor from "@/components/MainEditor";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MainEditor />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
