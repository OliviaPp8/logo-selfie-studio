import { ImageIcon, Download, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Company } from "./CompanySelector";
interface PreviewSectionProps {
  photo: string | null;
  company: Company | null;
  generatedImage: string | null;
  isGenerating: boolean;
}
const PreviewSection = ({
  photo,
  company,
  generatedImage,
  isGenerating
}: PreviewSectionProps) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `composite-${company?.name || 'image'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleShare = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'composite.png', {
        type: 'image/png'
      });
      if (navigator.share && navigator.canShare({
        files: [file]
      })) {
        await navigator.share({
          files: [file],
          title: 'My AI Composite'
        });
      } else {
        await navigator.clipboard.writeText(generatedImage);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };
  return <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        Preview
      </label>

      <div className="relative rounded-xl overflow-hidden border-2 border-border bg-gradient-to-br from-muted/50 to-muted min-h-[400px] flex items-center justify-center">
        {generatedImage ? <div className="w-full h-full min-h-[400px] flex items-center justify-center p-4">
            <img src={generatedImage} alt="Generated composite" className="max-w-full max-h-[380px] object-contain rounded-lg shadow-card" />
          </div> : isGenerating ? <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
            <div className="p-4 rounded-full bg-primary/10">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Generating your image...</p>
              <p className="text-sm mt-1">This may take a moment</p>
            </div>
          </div> : photo ? <div className="w-full h-full min-h-[400px] flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-2">
              <img src={photo} alt="Your photo" className="h-60 w-auto object-contain rounded-lg shadow-card" />
              <span className="text-xs text-muted-foreground">Your Photo</span>
            </div>
          </div> : <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
            <div className="p-4 rounded-full bg-muted">
              <ImageIcon className="w-12 h-12" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Your preview will appear here</p>
              
            </div>
          </div>}
      </div>

      {/* Action Buttons */}
      {generatedImage && <div className="flex gap-3 mt-4">
          <Button className="flex-1 gradient-button text-primary-foreground hover:opacity-90 transition-opacity" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>}
    </div>;
};
export default PreviewSection;