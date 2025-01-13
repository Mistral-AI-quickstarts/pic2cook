import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { exampleRecipes, type Recipe } from '../data/example-recipes'

interface ExampleRecipesProps {
  onSelectImage: (index: number) => void
}

export function ExampleRecipes({ onSelectImage }: ExampleRecipesProps) {
  const images = [
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80'
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Example Pictures</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exampleRecipes.map((recipe: Recipe, index: number) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={images[index]}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
              alt={recipe.dishName}
            />
            <div className="p-4">
              <Button onClick={() => onSelectImage(index)}>
                Use This Image
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

