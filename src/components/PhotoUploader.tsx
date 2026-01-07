import { useState, useCallback } from "react";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploaderProps {
  onPhotoChange: (photo: string | null) => void;
}

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.9;

async function fileToOptimizedDataUrl(file: File): Promise<string> {
  const originalDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

  if (originalDataUrl.length < 2_500_000) return originalDataUrl;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Failed to decode image"));
    i.src = originalDataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const targetW = Math.max(1, Math.round(img.width * scale));
  const targetH = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

const PhotoUploader = ({ onPhotoChange }: PhotoUploaderProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        try {
          toast.loading(t("uploader.optimizing"), { id: "photo-opt" });
          const result = await fileToOptimizedDataUrl(file);
          setPhoto(result);
          onPhotoChange(result);
          toast.success(t("uploader.ready"), { id: "photo-opt" });
        } catch (err) {
          console.error(err);
          toast.error(t("uploader.failed"), { id: "photo-opt" });
        }
      }
    },
    [onPhotoChange, t]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (file) {
      try {
        toast.loading(t("uploader.optimizing"), { id: "photo-opt" });
        const result = await fileToOptimizedDataUrl(file);
        setPhoto(result);
        onPhotoChange(result);
        toast.success(t("uploader.ready"), { id: "photo-opt" });
      } catch (err) {
        console.error(err);
        toast.error(t("uploader.failed"), { id: "photo-opt" });
      } finally {
        inputEl.value = "";
      }
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    onPhotoChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        {t("editor.uploadLabel")}
      </label>
      
      {photo ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 bg-muted/50">
          <img
            src={photo}
            alt="Uploaded photo"
            className="w-full h-64 object-contain bg-background"
          />
          <button
            onClick={clearPhoto}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-soft"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl h-64
            flex flex-col items-center justify-center gap-4
            transition-all duration-300 cursor-pointer
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragging ? "bg-primary/20" : "bg-muted"}
          `}>
            {isDragging ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="text-center px-4">
            <p className="font-medium text-foreground">
              {isDragging ? t("uploader.dropHere") : t("uploader.uploadPhoto")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("uploader.dragDrop")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
