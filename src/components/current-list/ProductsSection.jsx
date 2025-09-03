'use client'

import { AlertCircle, Check, Edit3, X } from "lucide-react"
import Product from "./Product"

export default function ProductsSection({
  currentList,
  toggleProductPurchased,
  setEditingProduct,
  deleteProduct,
  clearAllProducts,
  clearPurchasedProducts,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  supermarkets
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={clearPurchasedProducts}
          className={`px-4 py-2 rounded-lg bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 hover:bg-opacity-80`}
        >
          Rimuovi Acquistati
        </button>
        <button
          onClick={clearAllProducts}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Svuota Lista
        </button>
      </div>

      <div className="space-y-6">
        {currentList?.products.filter(p => !p.isPurchased).length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold text-white dark:text-gray-900 flex items-center gap-2`}>
              Da Comprare ({currentList?.products.filter(p => !p.isPurchased).length})
            </h3>
            <div className='flex flex-col gap-3'>
              {currentList?.products.filter(product => !product.isPurchased).map((product, index) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, product, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-gray-800 border-gray-700 dark:bg-white dark:border-gray-200 border rounded-lg p-4 cursor-move transition-all ${
                    product.isImportant ? 'border-red-500 border-2 dark:border-red-500' : ''
                  }`}
                >
                  <Product
                    product={product}
                    toggleProductPurchased={(e) => toggleProductPurchased(e)}
                    setEditingProduct={(e) => setEditingProduct(e)}
                    deleteProduct={(e) => deleteProduct(e)}
                    supermarkets={supermarkets}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentList?.products.filter(p => p.isPurchased).length > 0 && (
          <div className="space-y-3">
            <div className={`border-t pt-6 border-gray-700 dark:border-gray-200`}>
              <h3 className={`text-lg font-semibold text-gray-400 dark:text-gray-600 flex items-center gap-2 mb-4`}>
                <Check className="w-5 h-5" />
                Acquistati ({currentList?.products.filter(p => p.isPurchased).length})
              </h3>
              <div className='flex flex-col gap-3'>
                {currentList?.products.filter(product => product.isPurchased).map(product => (
                  <div
                    key={product.id}
                    className={`bg-gray-800/50 border-gray-700 dark:bg-gray-50 dark:border-gray-200 border rounded-lg p-4 opacity-75`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleProductPurchased(product)}
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 border-green-500 text-white flex items-center justify-center"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium line-through text-gray-500 dark:text-gray-400`}>
                            {product.name}
                          </span>
                          {product.isImportant && (
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className={`text-sm flex items-center gap-4 text-gray-500 dark:text-gray-500`}>
                          <span>{product.quantity} {product.quantityType}</span>
                          <span>{product.supermarket}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {/* <button
                          onClick={() => setEditingProduct(product)}
                          className={`flex-shrink-0 p-2 rounded-lg text-blue-400 hover:bg-gray-700 dark:text-blue-500 dark:hover:bg-blue-50`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className={`flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-gray-700 dark:text-red-500 dark:hover:bg-red-50`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
