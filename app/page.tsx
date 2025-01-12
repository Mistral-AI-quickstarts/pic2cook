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
      if (!result) {
        alert('Failed to get response from server')
        return
      }
      
      console.log('API Response:', result);
      
      if ('error' in result) {
        console.error('API Error:', result.error);
        alert(result.error)
        return
      }
      
      if (!result.recipe || !result.groceryList) {
        console.error('Invalid result structure:', result);
        alert('Failed to generate recipe. Please try again.')
        return
      }
      
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
          <div className="space-y-2">
            <div>
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
            </div>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/sophiamyang/pic2cook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary flex items-center gap-1"
              >
                <svg height="16" viewBox="0 0 16 16" width="16" className="fill-current">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
              </a>
              <span className="text-gray-400">|</span>
              <span>Apache 2.0 License</span>
            </div>
          </div>
        </footer>
      </main>
    </ErrorBoundary>
  )
}

