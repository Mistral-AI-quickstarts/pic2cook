'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

interface ImageUploadProps {
  onUpload: (imageData: string) => void
  preview: string | null
  setPreview: (preview: string | null) => void
  setError?: (error: string | null) => void
}

export function ImageUpload({ onUpload, preview, setPreview, setError }: ImageUploadProps) {
  const { data: session } = useSession()
  const [hasApiKey, setHasApiKey] = useState(false)

  // Check for API key on mount and when localStorage changes
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('mistral_api_key')
      setHasApiKey(!!apiKey)
    }

    // Initial check
    checkApiKey()

    // Listen for storage changes
    window.addEventListener('storage', checkApiKey)
    
    // Custom event for API key updates
    window.addEventListener('mistralApiKeyUpdated', checkApiKey)

    return () => {
      window.removeEventListener('storage', checkApiKey)
      window.removeEventListener('mistralApiKeyUpdated', checkApiKey)
    }
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!session || !hasApiKey) {
      if (session && !hasApiKey) {
        alert('Please add your Mistral API key in your profile to upload pictures')
      }
      return
    }

    // Clear any previous error when starting new upload
    setError?.(null)

    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        setPreview(base64data)
        onUpload(base64data)
      }
      reader.readAsDataURL(file)
    }
  }, [onUpload, session, hasApiKey, setPreview, setError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: !session
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${!session ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="text-lg">
          <p>Drop an image here, or click to select</p>
        </div>
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
          </div>
        )}
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            disabled={!session}
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation()
              if (!hasApiKey && session) {
                alert('Please add your Mistral API key in your profile to upload pictures')
                return
              }
              const input = document.querySelector('input[type="file"]')
              if (input) {
                input.click()
              }
            }}
          >
            Select Image
          </Button>
          {preview && (
            <Button
              type="button"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                if (preview) onUpload(preview)
              }}
            >
              Try Again with Same Image
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

