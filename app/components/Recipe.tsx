interface RecipeProps {
  recipe: string
}

export function Recipe({ recipe }: RecipeProps) {
  return (
    <div 
      className="bg-white shadow-md rounded-lg p-6 prose prose-sm max-w-none h-full"
      dangerouslySetInnerHTML={{ __html: recipe }}
    />
  )
}

