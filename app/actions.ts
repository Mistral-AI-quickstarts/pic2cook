'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function analyzeImageAndGenerateRecipe(imageData: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in the environment variables')
  }

  try {
    const response = await generateText({
      model: openai('gpt-4-vision-preview'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image and generate a recipe based on the main ingredients you see. Also, provide a list of groceries needed for the recipe.' },
            { type: 'image_url', image_url: { url: imageData } }
          ],
        },
      ],
    })

    if (!response.text) {
      throw new Error('No text generated from the AI model')
    }

    // Parse the response to extract recipe and grocery list
    const parts = response.text.split('Grocery List:')
    const recipe = parts[0].trim()
    const groceryList = parts[1] ? parts[1].trim().split('\n').map(item => item.trim().replace(/^-\s*/, '')) : []

    return { recipe, groceryList }
  } catch (error) {
    console.error('Error in analyzeImageAndGenerateRecipe:', error)
    throw error
  }
}

