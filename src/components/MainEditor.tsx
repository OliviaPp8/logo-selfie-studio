import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhotoUploader from "./PhotoUploader";
import CompanySelector, { type Company } from "./CompanySelector";
import PreviewSection from "./PreviewSection";
import { useGenerateComposite } from "@/hooks/useGenerateComposite";
import { useLanguage } from "@/contexts/LanguageContext";

const MainEditor = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { t } = useLanguage();
  
  const { isLoading, generatedImage, generateComposite, clearGeneratedImage } = useGenerateComposite();

  const handleGenerate = async () => {
    if (!photo || !selectedCompany?.templateUrl) return;
    
    await generateComposite({
      userPhoto: photo,
      companyName: selectedCompany.name,
      templateUrl: selectedCompany.templateUrl
    });
  };

  const handlePhotoChange = (newPhoto: string | null) => {
    setPhoto(newPhoto);
    clearGeneratedImage();
  };

  return (
    <section className="pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6 animate-slide-up animation-delay-300">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold">1</span>
                {t("editor.step1")}
              </h2>
              
              <div className="space-y-6">
                <PhotoUploader onPhotoChange={handlePhotoChange} />
                <CompanySelector 
                  onSelect={setSelectedCompany} 
                  selectedCompany={selectedCompany}
                />
                
              </div>
            </div>
            
            {/* Generate Button */}
            <Button
              className="w-full h-12 gradient-button text-primary-foreground hover:opacity-90 transition-opacity"
              disabled={!photo || !selectedCompany?.templateUrl || isLoading}
              onClick={handleGenerate}
              title={!selectedCompany?.templateUrl && selectedCompany ? t("editor.templateComingSoon") : ''}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("editor.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {!selectedCompany?.templateUrl && selectedCompany ? t("editor.templateComingSoon") : t("editor.generateButton")}
                </>
              )}
            </Button>
            
            {/* Tips Card */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-semibold text-primary mb-3">{t("tips.title")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t("tips.tip1")}</li>
                <li>• {t("tips.tip2")}</li>
                <li>• {t("tips.tip3")}</li>
              </ul>
            </div>
          </div>
          
          {/* Right Panel - Preview */}
          <div className="animate-slide-up animation-delay-300">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold">2</span>
                {t("editor.step2")}
              </h2>
              
              <PreviewSection 
                photo={photo} 
                company={selectedCompany}
                generatedImage={generatedImage}
                isGenerating={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainEditor;
