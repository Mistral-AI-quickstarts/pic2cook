'use server'

import { Mistral } from '@mistralai/mistralai'

export async function analyzeImageAndGenerateRecipe(imageData: string, userApiKey?: string, isUserUpload: boolean = false) {
  let client: Mistral

  try {
    if (isUserUpload) {
      if (!userApiKey) {
        return { error: 'Please add your Mistral API key in your profile to analyze uploaded images' }
      }
      if (!/^[a-zA-Z0-9]{32,}$/.test(userApiKey)) {
        return { error: 'Invalid API key format. Please check your API key.' }
      }
      client = new Mistral({ apiKey: userApiKey })
    } else {
      if (!process.env.MISTRAL_API_KEY) {
        return { error: 'No API key available for examples' }
      }
      client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
    }

    const response = await client.chat.complete({
      model: "pixtral-12b-2409",
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this food image and provide the following information with clear section delimiters:

####DISH_NAME####
Name of the dish you see in the image

####RECIPE####
<h2>Replace this with the same dish name from above</h2>
<h3>Instructions</h3>
<ol>
<li>Detailed steps including:
  - Temperature/heat level if applicable
  - Specific equipment needed
  - Visual cues for doneness
  - Time needed for the step</li>
</ol>
<h2>Total Time: X minutes</h2>

####GROCERY_LIST####
List each ingredient with quantity on a new line
Example:
2 cups rice
3 cloves garlic
1 large onion

Provide your response using exactly these delimiters and formats. Make sure to use the actual dish name in both the DISH_NAME section and in the recipe's h2 heading.` },
            { type: 'image_url', imageUrl: imageData }
          ],
        },
      ],
    }).catch(error => {
      if (error.message?.includes('401') || error.message?.includes('authentication')) {
        return { error: 'Invalid API key. Please check your API key in your profile.' }
      }
      if (error.message?.includes('403') || error.message?.includes('permission')) {
        return { error: 'API key does not have permission. Please check your API key.' }
      }
      if (error.message?.includes('API key')) {
        return { error: 'Invalid API key. Please check your API key in your profile.' }
      }
      return { error: 'Failed to process image. Please make sure you have a valid API key and try again.' }
    })

    if (!response) {
      return { error: 'No response from AI model' }
    }

    if ('error' in response) {
      return response || { error: 'Failed to process image' }
    }

    if (!response.choices) {
      return { error: 'No response received from AI model' }
    }

    const content = response.choices[0].message.content;
    if (!content) {
      return { error: 'Empty response from AI model' }
    }

    try {
      // Extract sections using delimiters
      const dishNameMatch = content.match(/####DISH_NAME####\s*([\s\S]*?)(?=####|$)/);
      const recipeMatch = content.match(/####RECIPE####\s*([\s\S]*?)(?=####|$)/);
      const groceryListMatch = content.match(/####GROCERY_LIST####\s*([\s\S]*?)(?=####|$)/);

      if (!dishNameMatch || !recipeMatch || !groceryListMatch) {
        console.error('Missing required sections in response:', content);
        return { error: 'Invalid response format from AI model' }
      }

      const dishName = dishNameMatch[1].trim();
      const recipe = recipeMatch[1].trim();
      const groceryList = groceryListMatch[1]
        .trim()
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const result = {
        dishName,
        recipe,
        groceryList
      };

      console.log('Final result:', result);
      return result;

    } catch (error) {
      console.error('Error processing response:', error);
      console.error('Raw content:', content);
      return { error: 'Failed to process AI response' }
    }
  } catch (error) {
    console.error('Error in analyzeImageAndGenerateRecipe:', error)
    return {
      error: error instanceof Error && error.message.includes('API key')
        ? error.message
        : 'Failed to process image. Please try again.'
    }
  }
}

