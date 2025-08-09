// src/components/shared/FileUploader.tsx
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/api/apiClient";
import { useToast } from "@/hooks/use-toast";

const uploadFileApi = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.error || "Upload failed", response.status);
  }
  return response.json();
};

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  onRemove: (url: string) => void;
  uploadedUrls: string[];
  maxFiles?: number;
}

export function FileUploader({
  onUploadSuccess,
  onRemove,
  uploadedUrls,
  maxFiles = 1,
}: FileUploaderProps) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return uploadFileApi(file, token);
    },
    onSuccess: (data) => {
      onUploadSuccess(data.url);
      toast({ title: t("notifications.upload.success") });
    },
    onError: (error: ApiError) => {
      toast({
        title: t("errors.upload.failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: t("errors.upload.tooLargeTitle"),
          description: t("errors.upload.tooLargeDescription", { size: 5 }),
          variant: "destructive",
        });
        return;
      }
      uploadFile(file);
    }
  };

  const canUploadMore = uploadedUrls.length < maxFiles;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {uploadedUrls.map((url) => (
          <div key={url} className="relative">
            <img
              src={url}
              alt="Uploaded preview"
              className="h-20 w-20 object-cover rounded-md border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => onRemove(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {canUploadMore && (
        <label className="relative flex items-center justify-center w-full h-24 border-2 border-border border-dashed rounded-md cursor-pointer hover:bg-accent">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isPending ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground font-sans">
                  <span className="font-semibold text-primary">
                    {t("fileUploader.clickToUpload")}
                  </span>{" "}
                  {t("fileUploader.orDragAndDrop")}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  {t("fileUploader.fileTypes", { size: 5 })}
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp"
            disabled={isPending}
          />
        </label>
      )}
    </div>
  );
}
