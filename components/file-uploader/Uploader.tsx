"use client";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export function Uploader() {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    progress: 0,
    uploading: false, // <--- add this
    isDeleting: false,
    fileType: "image",
  });

  function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // upload logic here
    } catch {
      // handle error
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // If more than 1 file, show toast
      if (acceptedFiles.length > 1) {
        toast.error("Too many files selected. Max is 1");
        return;
      }

      // If exactly 1 file, update state
      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];

        setFileState({
          file: file,
          uploading: false, // <--- make sure this is included
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          id: uuidv4(),
          isDeleting: false,
          error: false,
          fileType: "image",
        });

        console.log("Selected file:", file);
      }

      // Handle rejected files
      if (fileRejections.length) {
        fileRejections.forEach((rejection) => {
          rejection.errors.forEach((err) => {
            if (err.code === "file-too-large") {
              toast.error("File size exceeded 5MB");
            }
            if (err.code === "too-many-files") {
              toast.error("Too many files selected. Max is 1");
            }
          });
        });
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
}
