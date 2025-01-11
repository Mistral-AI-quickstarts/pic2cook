'use server'

import { Mistral } from '@mistralai/mistralai'

export async function analyzeImageAndGenerateRecipe(imageData: string) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error('Configuration error: Please check environment variables')
  }

  try {
    const client = new Mistral({ apiKey });
    
    const response = await client.chat.complete({
      model: "pixtral-12b",
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `You are a helpful cooking assistant. Given an image or description of food, provide a dish name, recipe and grocery list in JSON format.
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
        The groceryList should be an array of items needed, each including quantity (e.g., "2 cups rice", "3 cloves garlic", "1 large onion").` },
            { type: 'image_url', imageUrl: imageData }
          ],
        },
      ],
      response_format: {type: 'json_object'},
    })

    if (!response.choices) {
      throw new Error('No response received from AI model')
    }

    console.log(response.choices[0].message.content)
    // Clean and parse the JSON response
    const rawContent = response.choices[0].message.content
      .replace(/```json\n/, '')  // Remove opening ```json
      .replace(/\n```$/, '')     // Remove closing ```
      .replace(/[\n\r\t]/g, ' ') // Remove newlines, carriage returns, tabs
      .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
      .trim();                   // Remove leading/trailing whitespace
    
    try {
      const content = JSON.parse(rawContent);
      
      return {
        dishName: content.dishName,
        recipe: content.recipe,
        groceryList: Array.isArray(content.groceryList) 
          ? content.groceryList
          : [content.groceryList.toString()]
      }
    } catch (jsonError) {
      console.error('Error parsing JSON:', rawContent)
      throw jsonError
    }
  } catch (error) {
    console.error('Error in analyzeImageAndGenerateRecipe:', error)
    // Sanitize error message for production
    throw new Error('Failed to generate recipe. Please try again.')
  }
}

