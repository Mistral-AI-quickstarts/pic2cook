export interface Recipe {
  dishName: string
  recipe: string
  groceryList: string[]
}

export const exampleRecipes: Recipe[] = [
  {
    dishName: 'Spanish Paella',
    recipe: '<h2>Spanish Paella</h2><h3>Instructions</h3><ol><li>Preheat a large non-stick pan over medium-high heat. The pan is ready when a drop of water sizzles and evaporates immediately (2 minutes)</li><li>Using a sharp knife, dice vegetables into uniform 1/2-inch pieces. Keep onions separate from other vegetables (8 minutes)</li><li>Add oil to the hot pan and sauté onions until translucent and edges start to brown, stirring occasionally with a wooden spoon (5 minutes)</li><li>Add diced bell peppers and garlic, cook until fragrant, stirring occasionally (3 minutes)</li><li>Add rice to the pan and stir to coat evenly with oil and vegetables (2 minutes)</li><li>Pour in broth and bring to a boil, then reduce heat to medium-low, cover, and let simmer until rice is tender and liquid is absorbed (18-20 minutes)</li><li>Add shrimp and cook until pink and cooked through (5 minutes)</li><li>Remove from heat, add lemon wedges and chopped parsley for garnish (1 minute)</li></ol><h2>Total Time: 45 minutes</h2>',
    groceryList: [
      '2 cups short-grain rice',
      '1 large onion',
      '3 cloves garlic',
      '1 red bell pepper',
      '1 yellow bell pepper',
      '3 cups chicken or vegetable broth',
      '1 pound shrimp',
      '4 tablespoons olive oil',
      '1 lemon, cut into wedges',
      '1 bunch fresh parsley, chopped'
    ]
  },
  {
    dishName: 'Pesto Pasta Salad',
    recipe: '<h2>Pesto Pasta Salad</h2><h3>Instructions</h3><ol><li>Boil a large pot of water over high heat. Add 1 teaspoon of salt (5 minutes)</li><li>Cook the pasta according to package instructions until al dente. Drain and rinse under cold water to stop the cooking process (8-10 minutes)</li><li>In a large bowl, combine the cooked pasta, pesto, cherry tomatoes, and mixed greens. Toss gently to combine (3 minutes)</li></ol><h2>Total Time: 20 minutes</h2>',
    groceryList: [
      '8 oz bowtie pasta',
      '1/2 cup prepared pesto',
      '1 cup cherry tomatoes, halved',
      '2 cups mixed greens',
      'Salt'
    ]
  },
  {
    dishName: 'Berry Smoothie',
    recipe: '<h2>Berry Smoothie</h2><h3>Instructions</h3><ol><li>Rinse all berries under cold water to ensure they are clean (1 minute)</li><li>In a blender, combine all the berries, a liquid of your choice (like milk or juice), and any additional sweeteners or flavorings (honey, yogurt) (3 minutes)</li><li>Blend the mixture until smooth and creamy, stopping occasionally to scrape down the sides of the blender if needed (3 minutes)</li><li>Pour the smoothie into glasses and garnish with fresh berries and mint leaves for presentation (2 minutes)</li></ol><h2>Total Time: 9 minutes</h2>',
    groceryList: [
      '1 cup strawberries',
      '1 cup blueberries',
      '1 cup raspberries',
      '1 cup liquid (milk, juice, or water)',
      '1 tablespoon honey (optional)',
      '1 tablespoon yogurt (optional)',
      'Fresh mint leaves for garnish'
    ]
  }
] 