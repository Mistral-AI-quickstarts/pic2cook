'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Key, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [hasApiKey, setHasApiKey] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const storedKey = localStorage.getItem('mistral_api_key')
    setHasApiKey(!!storedKey)
  }, [])

  if (!session) return null

  const handleSaveApiKey = async () => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      localStorage.setItem('mistral_api_key', apiKey)
      setHasApiKey(true)
      setSuccess('API key saved successfully')
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('mistralApiKeyUpdated'))
      
      setTimeout(() => {
        setIsOpen(false)
        setSuccess('')
      }, 2000)
    } catch (error) {
      setError('Failed to save API key')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-5 w-5" />
            </Button>
            {!hasApiKey && (
              <div className="absolute -top-1 -right-1">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem className="text-sm">
            Signed in as {session.user?.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Key className="mr-2 h-4 w-4" />
            {hasApiKey ? 'Update Mistral API Key' : (
              <span className="flex items-center">
                Add Mistral API Key
                <AlertCircle className="ml-2 h-4 w-4 text-yellow-500" />
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {hasApiKey ? 'Update Mistral API Key' : 'Add Mistral API Key'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-500 bg-green-50 p-2 rounded">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium leading-none">
                API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Mistral API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Get your API key from{' '}
                <a
                  href="https://console.mistral.ai/api-keys/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mistral AI Console
                </a>
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save API Key'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 