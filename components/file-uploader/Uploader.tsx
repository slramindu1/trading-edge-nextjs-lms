"use client"
import type React from "react"
import { useState } from "react"
import { RenderEmptyState, RenderErrorState } from "@/components/render-empty-state"
import { X } from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
  name: string
  size: number
  type: string
  url?: string
}

interface UploaderProps {
  onFileUpload?: (filePath: string) => void // <-- new prop
}

export default function Uploader({ onFileUpload }: UploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [showError, setShowError] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"]

  // Generate random name like tradingedge57541
  const generateFileName = (original: File) => {
    const ext = original.name.split(".").pop()
    const randomId = Math.floor(10000 + Math.random() * 90000) // 5-digit number
    return `tradingedge${randomId}.${ext}`
  }

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(false) }
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length > 0) {
      toast.error("You can only upload one file. Remove the existing file first.")
      return
    }

    const file = files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPG, JPEG, PNG, WEBP, SVG) are allowed.")
      return
    }

    setIsUploading(true)
    setShowError(false)

    try {
      const renamedFile = generateFileName(file)
      const formData = new FormData()
      formData.append("file", file, renamedFile)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()

      const uploaded = {
        name: renamedFile,
        size: file.size,
        type: file.type,
        url: data.path,
      }

      setUploadedFiles([uploaded])
      toast.success("File uploaded successfully!")

      // Pass uploaded file path to parent form for validation
      onFileUpload?.(uploaded.url || "")
    } catch (error) {
      console.error("Upload failed:", error)
      setShowError(true)
      toast.error("File upload failed. Please try again.")
      onFileUpload?.("") // reset file key in form
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleDeleteFile = async (index: number) => {
    const file = uploadedFiles[index]
    try {
      await fetch("/api/delete", { method: "POST", body: JSON.stringify({ name: file.name }) })
    } catch (err) { console.error("Failed to delete file:", err) }

    setUploadedFiles([])
    toast.info("File removed successfully.")
    onFileUpload?.("") // reset file key in form
  }

  return (
    <div className="w-full bg-background p-4 rounded-lg mt-3">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-8">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="mt-6 mb-6"
          >
            <RenderEmptyState
              isDragActive={isDragActive}
              onFileSelect={handleFileInputChange}
              isUploading={isUploading}
              hasFile={uploadedFiles.length > 0}
              onRemoveFile={() => handleDeleteFile(0)}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Uploaded File</h3>
              <div className="grid gap-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(index)}
                      className="p-1 rounded-full hover:bg-destructive/10 transition-colors group"
                      aria-label={`Delete ${file.name}`}
                    >
                      <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showError && <RenderErrorState />}
        </div>
      </div>
    </div>
  )
}
