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

  const handleImageUpload = async (imageData: string) => {
    setIsLoading(true)
    setRecipe('')
    setGroceryList([])
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

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Generator</h1>
      <ExampleRecipes onSelectImage={handleImageUpload} />
      <ImageUpload onUpload={handleImageUpload} />
      {isLoading && <p className="text-center font-semibold">Analyzing image and generating recipe...</p>}
      
      {(recipe || groceryList.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2 mt-6 auto-rows-fr">
          <div className="h-full">
            {recipe && <Recipe recipe={recipe} />}
          </div>
          <div className="h-full">
            {groceryList.length > 0 && <GroceryList items={groceryList} />}
          </div>
        </div>
      )}
    </main>
  )
}

