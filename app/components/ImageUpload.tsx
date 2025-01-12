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
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
        min-h-[280px] flex flex-col justify-center items-center
        bg-gradient-to-b from-white to-gray-50
        ${isDragActive ? 'border-primary bg-primary/5 scale-[0.99] border-2' : 'border-gray-200 hover:border-primary/50'}
        ${!session ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:from-primary/5'}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-6 max-w-2xl w-full">
        <div className="space-y-2">
          <p className="text-xl font-medium text-gray-700">
            Drop an image here, or click to select
          </p>
        </div>
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="max-h-36 mx-auto rounded-xl shadow-md object-contain bg-white p-2"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-white/50">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm">JPEG, PNG, WebP</p>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            disabled={!session}
            size="lg"
            className="font-medium"
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
              size="lg"
              variant="outline"
              className="font-medium"
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

