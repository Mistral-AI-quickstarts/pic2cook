'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onUpload: (imageData: string) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (selectedImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        if (typeof result === 'string') {
          onUpload(result)
        } else {
          console.error('Failed to read image file')
          alert('Failed to read image file. Please try again.')
        }
      }
      reader.onerror = () => {
        console.error('Error reading file:', reader.error)
        alert('Error reading file. Please try again.')
      }
      reader.readAsDataURL(selectedImage)
    }
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-2 block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100"
      />
      <Button onClick={handleUpload} disabled={!selectedImage}>
        Generate Recipe
      </Button>
    </div>
  )
}

