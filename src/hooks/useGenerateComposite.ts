import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerateCompositeParams {
  userPhoto: string;
  companyName: string;
  templateUrl: string;
  withCZ: boolean;
}

export const useGenerateComposite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateComposite = async ({ userPhoto, companyName, templateUrl, withCZ }: GenerateCompositeParams) => {
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Convert relative template URL to absolute URL
      const absoluteTemplateUrl = templateUrl.startsWith('http') 
        ? templateUrl 
        : `${window.location.origin}${templateUrl}`;

      const { data, error } = await supabase.functions.invoke('generate-composite', {
        body: { userPhoto, companyName, templateUrl: absoluteTemplateUrl, withCZ }
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
