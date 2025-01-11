'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface GroceryListProps {
  items: string[]
}

export function GroceryList({ items }: GroceryListProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  const handleItemCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Grocery List</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`item-${index}`}
              checked={checkedItems[item] || false}
              onCheckedChange={() => handleItemCheck(item)}
            />
            <label
              htmlFor={`item-${index}`}
              className={`${checkedItems[item] ? 'line-through text-gray-500' : ''} cursor-pointer`}
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

