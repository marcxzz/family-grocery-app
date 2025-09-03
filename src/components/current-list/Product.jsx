'use client'

import { AlertCircle, Check, Edit3, GripVertical, X } from "lucide-react"

export default function Product({ product, toggleProductPurchased, setEditingProduct, deleteProduct, supermarkets }) {
  // console.log(product)
  return (
    <div className="flex items-center gap-3">
      <GripVertical className={`size-5 text-gray-500 dark:text-gray-400 cursor-grab active:cursor-grabbing`} />
      
      <button
        onClick={() => toggleProductPurchased(product)}
        className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center ${
          product.isPurchased ? 'bg-green-500 border-green-500 text-white' : ''
        } border-gray-600 hover:border-green-500 dark:border-gray-300 dark:hover:border-green-500`}
      >
        {product.isPurchased && <Check className="size-4" />}
      </button>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-white dark:text-gray-900`}>
            {product.name}
          </span>
          {product.isImportant && (
            <AlertCircle className="size-4 text-red-500" />
          )}
        </div>
        <div className={`text-sm flex items-center gap-2 text-gray-400 dark:text-gray-600`}>
          <span>{product.quantity} {product.quantityType}</span>
          {product.supermarketId && (
            <>
              <span>-</span>
              <span>{supermarkets.find(s => s.id == product.supermarketId)?.name}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        {/* <button
          onClick={() => setEditingProduct(product)}
          className={`flex-shrink-0 p-2 rounded-lg text-blue-400 hover:bg-gray-700 dark:text-blue-500 dark:hover:bg-blue-50`}
        >
          <Edit3 className="size-4" />
        </button> */}
        <button
          onClick={() => deleteProduct(product.id)}
          className={`flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-gray-700 dark:text-red-500 dark:hover:bg-red-50`}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
