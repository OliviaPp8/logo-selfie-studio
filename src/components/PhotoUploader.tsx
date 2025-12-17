import { useState, useCallback } from "react";
import { Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  onPhotoChange: (photo: string | null) => void;
}

const PhotoUploader = ({ onPhotoChange }: PhotoUploaderProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setPhoto(result);
          onPhotoChange(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onPhotoChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhoto(result);
        onPhotoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    onPhotoChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        Your Photo
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
              {isDragging ? "Drop your photo here" : "Upload your photo"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Drag & drop or click to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
