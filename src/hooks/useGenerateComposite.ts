import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerateCompositeParams {
  userPhoto: string;
  companyName: string;
  templateUrl: string;
  withCZ: boolean;
  isVibe?: boolean;
}

/**
 * Fetch an image from a URL and convert it to a base64 data URI
 */
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const useGenerateComposite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateComposite = async ({ userPhoto, companyName, templateUrl, withCZ, isVibe = false }: GenerateCompositeParams) => {
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Convert relative template URL to absolute URL for fetching from client
      const absoluteTemplateUrl = templateUrl.startsWith('http') 
        ? templateUrl 
        : `${window.location.origin}${templateUrl}`;

      // Fetch template image on client side and convert to base64
      // This avoids the edge function needing to fetch from preview URLs
      const templateBase64 = await fetchImageAsBase64(absoluteTemplateUrl);

      const { data, error } = await supabase.functions.invoke('generate-composite', {
        body: { userPhoto, companyName, templatePhoto: templateBase64, withCZ, isVibe }
      });

      if (error) {
        console.error('Function invoke error:', error);
        
        if (error.message?.includes('429')) {
          toast.error('Rate limit exceeded. Please try again later.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add more credits.');
        } else {
          toast.error(error.message || 'Failed to generate image');
        }
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      if (data?.image) {
        setGeneratedImage(data.image);
        toast.success('Image generated successfully!');
        return data.image;
      }

      toast.error('No image was generated');
      return null;

    } catch (err) {
      console.error('Generate composite error:', err);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearGeneratedImage = () => {
    setGeneratedImage(null);
  };

  return {
    isLoading,
    generatedImage,
    generateComposite,
    clearGeneratedImage
  };
};
