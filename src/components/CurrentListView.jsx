'use client'

import { Plus, Check, AlertCircle, Edit3, X, GripVertical, ArrowLeft } from 'lucide-react';

export default function CurrentListView({
  isDark,
  currentList,
  setCurrentList,
  setShowNewProductForm,
  clearPurchasedProducts,
  clearAllProducts,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  dragOverIndex,
  toggleProductPurchased,
  setEditingProduct,
  deleteProduct
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentList(null)}
            className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline mb-2 flex items-center gap-2`}
          >
            <ArrowLeft /> Torna alle liste
          </button>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentList.title}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentList.supermarket}
          </p>
        </div>
        <button
          onClick={() => setShowNewProductForm(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Plus className="w-5 h-5" />
          Aggiungi
        </button>
      </div>

      {currentList.products.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={clearPurchasedProducts}
            className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} hover:bg-opacity-80`}
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
      )}

      {currentList.products.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Lista vuota</p>
          <p>Aggiungi il primo prodotto alla tua lista!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentList.products.filter(p => !p.isPurchased).length > 0 && (
            <div className="space-y-3">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                Da Comprare ({currentList.products.filter(p => !p.isPurchased).length})
              </h3>
              {currentList.products
                .filter(product => !product.isPurchased)
                .map((product, index) => (
                  <div
                    key={product.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, product, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 cursor-move transition-all ${
                      product.isImportant ? 'border-red-500 border-2' : ''
                    } ${
                      dragOverIndex === index ? 'border-blue-500 border-2 bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'} cursor-grab active:cursor-grabbing`} />
                      
                      <button
                        onClick={() => toggleProductPurchased(product.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          product.isPurchased
                            ? 'bg-green-500 border-green-500 text-white'
                            : isDark ? 'border-gray-600 hover:border-green-500' : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {product.isPurchased && <Check className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {product.name}
                          </span>
                          {product.isImportant && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className={`text-sm flex items-center gap-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>{product.quantity}{product.quantityType}</span>
                          <span>{product.supermarket}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className={`flex-shrink-0 p-2 rounded-lg ${isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-500 hover:bg-blue-50'}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className={`flex-shrink-0 p-2 rounded-lg ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {currentList.products.filter(p => p.isPurchased).length > 0 && (
            <div className="space-y-3">
              <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 mb-4`}>
                  <Check className="w-5 h-5" />
                  Acquistati ({currentList.products.filter(p => p.isPurchased).length})
                </h3>
                {currentList.products
                  .filter(product => product.isPurchased)
                  .map(product => (
                    <div
                      key={product.id}
                      className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 opacity-75`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleProductPurchased(product.id)}
                          className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 border-green-500 text-white flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {product.name}
                            </span>
                            {product.isImportant && (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className={`text-sm flex items-center gap-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            <span>{product.quantity}{product.quantityType}</span>
                            <span>{product.supermarket}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className={`flex-shrink-0 p-2 rounded-lg ${isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-500 hover:bg-blue-50'}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className={`flex-shrink-0 p-2 rounded-lg ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
