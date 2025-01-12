'use client'

import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { Recipe } from './components/Recipe'
import { GroceryList } from './components/GroceryList'
import { ExampleRecipes } from './components/ExampleRecipes'
import { analyzeImageAndGenerateRecipe } from './actions'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserMenu } from './components/UserMenu'

export default function Home() {
  const { data: session, status } = useSession()
  const [recipe, setRecipe] = useState('')
  const [groceryList, setGroceryList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imageSource, setImageSource] = useState<'upload' | 'example' | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (imageData: string) => {
    if (!session) {
      signIn(undefined, { callbackUrl: '/' })
      return
    }

    const userApiKey = localStorage.getItem('mistral_api_key')
    if (!userApiKey) {
      alert('Please add your Mistral API key in your profile to upload pictures')
      return
    }

    setIsLoading(true)
    setRecipe('')
    setGroceryList([])
    setError(null)
    setImageSource('upload')
    
    try {
      const result = await analyzeImageAndGenerateRecipe(
        imageData,
        userApiKey,
        true
      )
      if ('error' in result) {
        setError(result.error)
        if (result.error.includes('API key')) {
          localStorage.removeItem('mistral_api_key')
        }
        return
      }
      setRecipe(result.recipe)
      setGroceryList(result.groceryList)
    } catch (error) {
      console.error('Error in handleImageUpload:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleSelect = async (imageData: string) => {
    setIsLoading(true)
    setRecipe('')
    setGroceryList([])
    setImageSource('example')
    try {
      // Pass false for isUserUpload to use environment API key
      const result = await analyzeImageAndGenerateRecipe(imageData, undefined, false)
      setRecipe(result.recipe)
      setGroceryList(result.groceryList)
    } catch (error) {
      console.error('Error in handleExampleSelect:', error)
      alert(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRerun = async () => {
    if (!preview) return
    
    const userApiKey = localStorage.getItem('mistral_api_key')
    if (!userApiKey) {
      alert('Please add your Mistral API key in your profile to analyze pictures')
      return
    }

    setIsLoading(true)
    setRecipe('')
    setGroceryList([])
    
    try {
      const result = await analyzeImageAndGenerateRecipe(
        preview,
        userApiKey,
        true
      )
      setRecipe(result.recipe)
      setGroceryList(result.groceryList)
    } catch (error) {
      console.error('Error in handleRerun:', error)
      if (error instanceof Error && error.message.includes('API key')) {
        alert('There was an issue with your API key. Please check it in your profile.')
      } else {
        alert(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const ResultsSection = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
        <div className="h-full">
          {recipe && <Recipe recipe={recipe} />}
        </div>
        <div className="h-full">
          {groceryList.length > 0 && <GroceryList items={groceryList} />}
        </div>
      </div>
    </div>
  )

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <ErrorBoundary>
      <main className="container mx-auto p-4 max-w-6xl">
        <header className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-primary mb-3">Pic2Cook</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform any food picture into a detailed recipe and grocery list instantly
            </p>
          </div>
          <div className="absolute right-8 top-8">
            <UserMenu />
          </div>
        </header>

        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <ImageUpload 
            onUpload={handleImageUpload}
            preview={preview}
            setPreview={setPreview}
            setError={setError}
          />
          {!session && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/40 to-black/50 backdrop-blur-[1px] flex items-center justify-center p-4">
              <div className="bg-white/95 p-5 rounded-xl shadow-xl text-center max-w-[320px] mx-auto backdrop-blur-xl border border-white/20">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Upload Your Own Pictures</h3>
                  </div>
                  <div className="space-y-4">
                    <ol className="text-left space-y-2 list-none text-sm">
                      {[
                        'Sign in to your account',
                        'Add your Mistral API key',
                        'Start uploading pictures!'
                      ].map((step, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="flex-none w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                            {i + 1}
                          </span>
                          <span className="text-gray-600">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <Button 
                      onClick={() => signIn(undefined, { callbackUrl: '/' })}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      Sign In to Continue
                    </Button>
                    <p className="text-xs text-gray-500">
                      Try example pictures below without signing in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading && imageSource === 'upload' && (
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-primary animate-pulse">
              Analyzing image and generating recipe & grocery list...
            </p>
          </div>
        )}

        {error && imageSource === 'upload' && (
          <div className="mt-8 text-center">
            <p className="text-red-500 font-medium bg-red-50 py-3 px-4 rounded-lg inline-block">
              {error}
            </p>
          </div>
        )}

        {imageSource === 'upload' && !error && (recipe || groceryList.length > 0) && (
          <div className="mt-8">
            <ResultsSection />
          </div>
        )}
        
        <div className="mt-16 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Try Example Pictures</h2>
            <p className="text-gray-600">No sign-in required - see how it works!</p>
          </div>
          <ExampleRecipes onSelectImage={handleExampleSelect} />
          {isLoading && imageSource === 'example' && (
            <p className="text-lg font-medium text-primary text-center animate-pulse">
              Analyzing image and generating recipe & grocery list...
            </p>
          )}
          {imageSource === 'example' && (recipe || groceryList.length > 0) && (
            <div className="mt-8">
              <ResultsSection />
            </div>
          )}
        </div>

        <footer className="mt-24 pb-8 text-center text-sm text-gray-500 border-t pt-8">
          Powered by{' '}
          <a 
            href="https://mistral.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Mistral AI
          </a>
          {' '}Pixtral 12B
        </footer>
      </main>
    </ErrorBoundary>
  )
}

