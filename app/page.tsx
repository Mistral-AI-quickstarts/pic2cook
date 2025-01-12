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

  const handleImageUpload = async (imageData: string) => {
    if (!session) {
      signIn(undefined, { callbackUrl: '/' })
      return
    }

    // Get user's API key for personal uploads
    const userApiKey = localStorage.getItem('mistral_api_key')
    if (!userApiKey) {
      alert('Please add your Mistral API key in your profile to upload pictures')
      return
    }

    setIsLoading(true)
    setRecipe('')
    setGroceryList([])
    setImageSource('upload')
    
    try {
      const result = await analyzeImageAndGenerateRecipe(
        imageData,
        userApiKey,
        true // This is a user upload
      )
      setRecipe(result.recipe)
      setGroceryList(result.groceryList)
    } catch (error) {
      console.error('Error in handleImageUpload:', error)
      if (error instanceof Error && error.message.includes('API key')) {
        alert('There was an issue with your API key. Please check it in your profile.')
      } else {
        alert(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.')
      }
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

  const ResultsSection = () => (
    <div className="grid gap-6 md:grid-cols-2 mt-6 auto-rows-fr">
      <div className="h-full">
        {recipe && <Recipe recipe={recipe} />}
      </div>
      <div className="h-full">
        {groceryList.length > 0 && <GroceryList items={groceryList} />}
      </div>
    </div>
  )

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <ErrorBoundary>
      <main className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-primary mb-2">Pic2Cook</h1>
            <p className="text-lg text-gray-600">
              Snap a photo of any food and instantly get a detailed recipe and grocery list
            </p>
          </div>
          <div className="absolute right-8 top-8">
            <UserMenu />
          </div>
        </header>

        <div className="relative">
          <ImageUpload onUpload={handleImageUpload} />
          {!session && (
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg mb-4">
                  Sign in and add your Mistral API key to analyze your own pictures
                </p>
                <Button onClick={() => signIn(undefined, { callbackUrl: '/' })}>
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>

        {isLoading && imageSource === 'upload' && (
          <p className="text-center font-semibold">Analyzing image and generating recipe & grocery list...</p>
        )}
        {imageSource === 'upload' && (recipe || groceryList.length > 0) && <ResultsSection />}
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Try with Example Pictures</h2>
          <ExampleRecipes onSelectImage={handleExampleSelect} />
          {isLoading && imageSource === 'example' && (
            <p className="text-center font-semibold">Analyzing image and generating recipe & grocery list...</p>
          )}
          {imageSource === 'example' && (recipe || groceryList.length > 0) && <ResultsSection />}
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          Powered by{' '}
          <a 
            href="https://mistral.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Mistral AI
          </a>
          {' '}Pixtral 12B
        </footer>
      </main>
    </ErrorBoundary>
  )
}

