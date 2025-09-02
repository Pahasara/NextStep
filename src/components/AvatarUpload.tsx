import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUpload = ({ userId, currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size too large. Maximum size is 2MB.');
      }

      // Convert file to base64 data URL for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            // Check if the base64 string is too large (limit to ~1MB base64 which is ~750KB file)
            if (dataUrl.length > 1400000) {
              throw new Error('Image too large after processing. Please try a smaller image.');
            }
            onAvatarUpdate(dataUrl);
            toast.success('Avatar updated successfully! Remember to save your profile to persist changes.');
          } else {
            throw new Error('Failed to read the image file.');
          }
        } catch (error: any) {
          toast.error('Error processing avatar: ' + error.message);
        } finally {
          setUploading(false);
          // Clear the input
          event.target.value = '';
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read the image file.');
        setUploading(false);
        // Clear the input
        event.target.value = '';
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      toast.error('Error uploading avatar: ' + error.message);
      setUploading(false);
    }
    // Note: setUploading(false) is handled in the reader callbacks above
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Profile Photo</span>
        </CardTitle>
        <CardDescription>
          Upload a profile photo to personalize your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentAvatarUrl} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white">
              <Camera className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button asChild disabled={uploading} variant="outline">
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </span>
              </Button>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarUpload;