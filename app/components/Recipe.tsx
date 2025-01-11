interface RecipeProps {
  recipe: string
}

export function Recipe({ recipe }: RecipeProps) {
  return (
    <div className="mb-4 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">Recipe</h2>
      <div className="whitespace-pre-wrap">{recipe}</div>
    </div>
  )
}

