import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ExampleRecipe {
  id: number
  name: string
  image: string
}

const exampleRecipes: ExampleRecipe[] = [
  {
    id: 1,
    name: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
  },
  {
    id: 2,
    name: 'Chicken Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',
  },
  {
    id: 3,
    name: 'Berry Smoothie',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80',
  },
]

interface ExampleRecipesProps {
  onSelectImage: (imageData: string) => void
}

export function ExampleRecipes({ onSelectImage }: ExampleRecipesProps) {
  const handleImageSelect = (imageUrl: string) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result as string
          onSelectImage(base64data)
        }
        reader.readAsDataURL(blob)
      })
      .catch(error => {
        console.error('Error fetching image:', error)
        alert('Failed to load example image. Please try again.')
      })
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Example Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exampleRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.name}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{recipe.name}</h3>
              <Button onClick={() => handleImageSelect(recipe.image)}>
                Use This Image
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

