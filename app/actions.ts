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
      model: "pixtral-large-latest",
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this food image and return ONLY a JSON object with no additional text. The JSON should have three keys:
        The response should be a valid JSON object with three main keys: "dishName", "recipe" and "groceryList".
        The dishName should be a string.
        The recipe should be one single string that's HTML formatted with clear sections for:
          - Title (h2)
          - Instructions (h3 with ordered list, each step including:
              * Detailed action description
              * Temperature/heat level if applicable
              * Specific equipment needed
              * Visual cues for doneness
              * Time needed for the step)
          - Total Time (h2)
        Example recipe format: "<h2>Dish Name</h2><h3>Instructions</h3><ol>
          <li>Preheat a large non-stick pan over medium-high heat. The pan is ready when a drop of water sizzles and evaporates immediately (2 minutes)</li>
          <li>Using a sharp knife, dice vegetables into uniform 1/2-inch pieces. Keep onions separate from other vegetables (8 minutes)</li>
          <li>Add oil to the hot pan and sauté onions until translucent and edges start to brown, stirring occasionally with a wooden spoon (5 minutes)</li>
          </ol><h2>Total Time: 15 minutes</h2>"
        The groceryList should be an array of items needed, each including quantity (e.g., "2 cups rice", "3 cloves garlic", "1 large onion").
        Return ONLY the JSON object with no additional text or explanation.` },
            { type: 'image_url', imageUrl: imageData }
          ],
        },
      ],
      response_format: {type: 'json_object'},
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

    if (!response || 'error' in response) {
      return response || { error: 'Failed to process image' }
    }

    if (!response.choices) {
      return { error: 'No response received from AI model' }
    }

    console.log(response.choices[0].message.content)
    // Clean and parse the JSON response
    const rawContent = response.choices[0].message.content
      .replace(/^[\s\S]*?({[\s\S]*})[\s\S]*$/, '$1') // Extract JSON object
      .replace(/\\\s*/g, '')     // Remove escaped whitespace
      .trim();
    
    try {
      const content = JSON.parse(rawContent);
      
      // Validate the required fields exist
      if (!content.recipe || !content.dishName || !content.groceryList) {
        console.error('Missing required fields in JSON response:', content)
        return { error: 'Invalid response format from AI model' }
      }
      
      return {
        dishName: content.dishName,
        recipe: content.recipe,
        groceryList: Array.isArray(content.groceryList) 
          ? content.groceryList
          : [content.groceryList.toString()]
      }
    } catch (jsonError) {
      console.error('Error parsing JSON:', rawContent)
      return { error: 'Failed to parse AI response' }
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

