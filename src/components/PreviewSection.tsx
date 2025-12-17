import { ImageIcon, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Company } from "./CompanySelector";
interface PreviewSectionProps {
  photo: string | null;
  company: Company | null;
}
const companyLogos: Record<string, string> = {
  google: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  meta: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  tesla: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  nvidia: "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg",
  netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  openai: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
  spacex: "https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo-Xonly.svg"
};
const PreviewSection = ({
  photo,
  company
}: PreviewSectionProps) => {
  const hasContent = photo && company;
  return <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        Preview
      </label>
      
      <div className="relative rounded-xl overflow-hidden border-2 border-border bg-gradient-to-br from-muted/50 to-muted min-h-[400px] flex items-center justify-center">
        {hasContent ? <div className="relative w-full h-full min-h-[400px] flex items-end justify-center p-8 gap-4">
            {/* User Photo */}
            <div className="relative z-10 flex-shrink-0">
              <img src={photo} alt="Your photo" className="h-80 w-auto object-contain rounded-lg shadow-card" />
            </div>
            
            {/* Company Logo */}
            <div className="relative z-10 flex-shrink-0 p-6 bg-card/90 backdrop-blur-sm rounded-2xl shadow-card animate-float">
              <img src={companyLogos[company.id]} alt={`${company.name} logo`} className="h-20 w-auto object-contain" style={{
            filter: company.id === "apple" ? "invert(0)" : "none"
          }} />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div> : <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
            <div className="p-4 rounded-full bg-muted">
              <ImageIcon className="w-12 h-12" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Your preview will appear here</p>
              <p className="text-sm mt-1">Upload a photo and select a company in the section above to get started</p>
            </div>
          </div>}
      </div>
      
      {/* Action Buttons */}
      {hasContent && <div className="flex gap-3 mt-4">
          <Button className="flex-1 gradient-button text-primary-foreground hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>}
    </div>;
};
export default PreviewSection;