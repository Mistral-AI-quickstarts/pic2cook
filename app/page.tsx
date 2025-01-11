'use client'

import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { Recipe } from './components/Recipe'
import { GroceryList } from './components/GroceryList'
import { ExampleRecipes } from './components/ExampleRecipes'
import { analyzeImageAndGenerateRecipe } from './actions'

export default function Home() {
  const [recipe, setRecipe] = useState('')
  const [groceryList, setGroceryList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imageSource, setImageSource] = useState<'upload' | 'example' | null>(null)

  const handleImageUpload = async (imageData: string) => {
    setIsLoading(true)
    setRecipe('')
    setGroceryList([])
    setImageSource('upload')
    try {
      const result = await analyzeImageAndGenerateRecipe(imageData)
      setRecipe(result.recipe)
      setGroceryList(result.groceryList)
    } catch (error) {
      console.error('Error in handleImageUpload:', error)
      alert(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.')
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
      const result = await analyzeImageAndGenerateRecipe(imageData)
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

  return (
    <main className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Pic2Cook</h1>
        <p className="text-lg text-gray-600">
          Snap a photo of any food and instantly get a detailed recipe and grocery list
        </p>
      </div>
      
      <ImageUpload onUpload={handleImageUpload} />
      {isLoading && imageSource === 'upload' && (
        <p className="text-center font-semibold">Analyzing image and generating recipe...</p>
      )}
      {imageSource === 'upload' && (recipe || groceryList.length > 0) && <ResultsSection />}
      
      <div className="mt-12">
        <ExampleRecipes onSelectImage={handleExampleSelect} />
        {isLoading && imageSource === 'example' && (
          <p className="text-center font-semibold">Analyzing image and generating recipe...</p>
        )}
        {imageSource === 'example' && (recipe || groceryList.length > 0) && <ResultsSection />}
      </div>
    </main>
  )
}

