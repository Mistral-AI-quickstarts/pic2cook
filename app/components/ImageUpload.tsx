'use client'

import { useState } from 'react'
import { Upload, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onUpload: (imageData: string) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      onUpload(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload Your Food Picture</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag and drop your food photo here</p>
            <p className="text-sm text-gray-500 mt-1">or use one of these options</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose File
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('camera-upload')?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Supports: JPG, PNG, WEBP • Max size: 5MB
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
        <input
          id="camera-upload"
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>
    </div>
  )
}

