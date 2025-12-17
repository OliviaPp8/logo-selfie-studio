import { useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateUploaderProps {
  onTemplateChange: (template: string | null) => void;
}

const TemplateUploader = ({ onTemplateChange }: TemplateUploaderProps) => {
  const [template, setTemplate] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setTemplate(result);
        onTemplateChange(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onTemplateChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearTemplate = () => {
    setTemplate(null);
    onTemplateChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        Template Photo (Model + Background)
      </label>

      {template ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 bg-muted/30">
          <img
            src={template}
            alt="Template"
            className="w-full h-48 object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearTemplate}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer h-48 flex items-center justify-center ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("template-input")?.click()}
        >
          <input
            id="template-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center gap-3 text-muted-foreground p-4">
            <div className="p-3 rounded-full bg-muted">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground text-sm">
                Upload template photo
              </p>
              <p className="text-xs mt-1">
                Photo with model + company background
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateUploader;
