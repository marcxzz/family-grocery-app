'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Check, AlertCircle, Moon, Sun, ShoppingCart, Edit3, X, GripVertical, ArrowLeft } from 'lucide-react'

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [lists, setLists] = useState([])
  const [currentList, setCurrentList] = useState(null)
  const [showNewListForm, setShowNewListForm] = useState(false)
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [editingList, setEditingList] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [draggedProduct, setDraggedProduct] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const supermarkets = ['Lidl', 'Hardis', 'Carrefour', 'Iperpan', 'Coop', 'Esselunga', 'Conad', 'Altro']
  const quantityTypes = [
    { value: 'pz', label: 'Pezzi' },
    { value: 'kg', label: 'Chilogrammi' },
    { value: 'g', label: 'Grammi' },
    { value: 'l', label: 'Litri' },
    { value: 'ml', label: 'Millilitri' },
    { value: 'x', label: 'Unità' }
  ]

  const createList = (title, supermarket) => {
    const newList = {
      id: Date.now(),
      title,
      supermarket,
      products: []
    }
    setLists([...lists, newList])
    setCurrentList(newList)
    setShowNewListForm(false)
  }

  const updateList = (listId, title, supermarket) => {
    const updatedLists = lists.map(list => 
      list.id === listId ? { ...list, title, supermarket } : list
    )
    setLists(updatedLists)
    if (currentList && currentList.id === listId) {
      setCurrentList({ ...currentList, title, supermarket })
    }
    setEditingList(null)
  }

  const deleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId)
    setLists(updatedLists)
    if (currentList && currentList.id === listId) {
      setCurrentList(null)
    }
  }

  const addProduct = (name, quantity, quantityType, supermarket, isImportant) => {
    const newProduct = {
      id: Date.now(),
      name,
      quantity,
      quantityType,
      supermarket,
      isImportant,
      isPurchased: false
    }

    const updatedList = {
      ...currentList,
      products: [...currentList.products, newProduct]
    }

    // Sort products after adding
    updatedList.products = sortProducts(updatedList.products)

    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
    setShowNewProductForm(false)
  }

  const updateProduct = (productId, name, quantity, quantityType, supermarket, isImportant) => {
    const updatedProducts = currentList.products.map(product =>
      product.id === productId 
        ? { ...product, name, quantity, quantityType, supermarket, isImportant }
        : product
    )

    const sortedProducts = sortProducts(updatedProducts)
    const updatedList = { ...currentList, products: sortedProducts }
    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
    setEditingProduct(null)
  }

  const sortProducts = (products) => {
    const unpurchased = products.filter(p => !p.isPurchased)
    const purchased = products.filter(p => p.isPurchased)
    
    // Sort unpurchased: important first, then by order
    unpurchased.sort((a, b) => {
      if (a.isImportant !== b.isImportant) {
        return b.isImportant ? 1 : -1
      }
      return 0
    })
    
    return [...unpurchased, ...purchased]
  }

  const toggleProductPurchased = (productId) => {
    const updatedProducts = currentList.products.map(product =>
      product.id === productId ? { ...product, isPurchased: !product.isPurchased } : product
    )

    const sortedProducts = sortProducts(updatedProducts)

    const updatedList = { ...currentList, products: sortedProducts }
    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
  }

  const deleteProduct = (productId) => {
    const updatedProducts = currentList.products.filter(product => product.id !== productId)
    const updatedList = { ...currentList, products: updatedProducts }
    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
  }

  const clearAllProducts = () => {
    const updatedList = { ...currentList, products: [] }
    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
  }

  const clearPurchasedProducts = () => {
    const updatedProducts = currentList.products.filter(product => !product.isPurchased)
    const updatedList = { ...currentList, products: updatedProducts }
    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
  }

  const handleDragStart = (e, product, index) => {
    setDraggedProduct({ product, index })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    setDragOverIndex(null)
    
    if (!draggedProduct || draggedProduct.index === dropIndex) {
      setDraggedProduct(null)
      return
    }

    const products = [...currentList.products]
    const unpurchasedProducts = products.filter(p => !p.isPurchased)
    const purchasedProducts = products.filter(p => p.isPurchased)
    
    // Only allow reordering within unpurchased products
    if (draggedProduct.product.isPurchased || dropIndex >= unpurchasedProducts.length) {
      setDraggedProduct(null)
      return
    }

    // Remove the dragged item
    unpurchasedProducts.splice(draggedProduct.index, 1)
    // Insert at new position
    unpurchasedProducts.splice(dropIndex, 0, draggedProduct.product)
    
    const reorderedProducts = [...unpurchasedProducts, ...purchasedProducts]
    
    const updatedList = { ...currentList, products: reorderedProducts }
    setCurrentList(updatedList)
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list))
    setDraggedProduct(null)
  }

  const NewListForm = () => {
    const [title, setTitle] = useState('')
    const [supermarket, setSupermarket] = useState('')

    return (
      <div className={`fixed inset-0 ${isDark ? 'bg-black bg-opacity-50' : 'bg-gray-600 bg-opacity-50'} flex items-center justify-center p-4 z-50`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Nuova Lista della Spesa
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome della lista"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            />
            <select
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            >
              <option value="">Scegli supermercato</option>
              {supermarkets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => title && supermarket && createList(title, supermarket)}
              disabled={!title || !supermarket}
              className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crea Lista
            </button>
            <button
              onClick={() => setShowNewListForm(false)}
              className={`flex-1 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} p-3 rounded-lg hover:bg-gray-300`}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  const EditProductForm = ({ product }) => {
    const [name, setName] = useState(product.name)
    const [quantity, setQuantity] = useState(product.quantity)
    const [quantityType, setQuantityType] = useState(product.quantityType)
    const [supermarket, setSupermarket] = useState(product.supermarket)
    const [isImportant, setIsImportant] = useState(product.isImportant)

    return (
      <div className={`fixed inset-0 ${isDark ? 'bg-black bg-opacity-50' : 'bg-gray-600 bg-opacity-50'} flex items-center justify-center p-4 z-50`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Modifica Prodotto
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome prodotto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`flex-1 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
              />
              <select
                value={quantityType}
                onChange={(e) => setQuantityType(e.target.value)}
                className={`flex-1 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
              >
                {quantityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <select
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            >
              <option value="">Scegli supermercato</option>
              {supermarkets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-5 h-5 text-red-500"
              />
              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Urgente/Importante</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => name && quantity && quantityType && supermarket && updateProduct(product.id, name, quantity, quantityType, supermarket, isImportant)}
              disabled={!name || !quantity || !quantityType || !supermarket}
              className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salva
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className={`flex-1 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} p-3 rounded-lg hover:bg-gray-300`}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  const EditListForm = ({ list }) => {
    const [title, setTitle] = useState(list.title)
    const [supermarket, setSupermarket] = useState(list.supermarket)

    return (
      <div className={`fixed inset-0 ${isDark ? 'bg-black bg-opacity-50' : 'bg-gray-600 bg-opacity-50'} flex items-center justify-center p-4 z-50`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Modifica Lista
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome della lista"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            />
            <select
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            >
              <option value="">Scegli supermercato</option>
              {supermarkets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => title && supermarket && updateList(list.id, title, supermarket)}
              disabled={!title || !supermarket}
              className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salva
            </button>
            <button
              onClick={() => setEditingList(null)}
              className={`flex-1 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} p-3 rounded-lg hover:bg-gray-300`}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  const NewProductForm = () => {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('1')
    const [quantityType, setQuantityType] = useState('x')
    const [supermarket, setSupermarket] = useState(currentList?.supermarket || '')
    const [isImportant, setIsImportant] = useState(false)

    return (
      <div className={`fixed inset-0 ${isDark ? 'bg-black bg-opacity-50' : 'bg-gray-600 bg-opacity-50'} flex items-center justify-center p-4 z-50`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Aggiungi Prodotto
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome prodotto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`flex-1 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
              />
              <select
                value={quantityType}
                onChange={(e) => setQuantityType(e.target.value)}
                className={`flex-1 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
              >
                {quantityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <select
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
            >
              <option value="">Scegli supermercato</option>
              {supermarkets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-5 h-5 text-red-500"
              />
              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Urgente/Importante</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => name && quantity && quantityType && supermarket && addProduct(name, quantity, quantityType, supermarket, isImportant)}
              disabled={!name || !quantity || !quantityType || !supermarket}
              className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Aggiungi
            </button>
            <button
              onClick={() => setShowNewProductForm(false)}
              className={`flex-1 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} p-3 rounded-lg hover:bg-gray-300`}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-4`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <ShoppingCart className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Lista della Spesa
            </h1>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Lists Overview */}
        {!currentList && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Le Tue Liste
              </h2>
              <button
                onClick={() => setShowNewListForm(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
                Nuova Lista
              </button>
            </div>

            {lists.length === 0 ? (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nessuna lista creata</p>
                <p>Crea la tua prima lista della spesa!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lists.map(list => (
                  <div
                    key={list.id}
                    className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div onClick={() => setCurrentList(list)} className="flex-1">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {list.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {list.supermarket}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingList(list)
                          }}
                          className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteList(list.id)
                          }}
                          className={`p-2 rounded-lg ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div onClick={() => setCurrentList(list)} className="space-y-1">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {list.products.length} prodotti
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {list.products.filter(p => p.isPurchased).length} completati
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current List View */}
        {currentList && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setCurrentList(null)}
                  className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-500'} hover:underline mb-2 flex gap-2 items-center`}
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

            {/* Action Buttons */}
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

            {/* Products List */}
            {currentList.products.length === 0 ? (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Lista vuota</p>
                <p>Aggiungi il primo prodotto alla tua lista!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Unpurchased Products */}
                {currentList.products.filter(p => !p.isPurchased).length > 0 && (
                  <div className="space-y-3">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                      <ShoppingCart className="w-5 h-5" />
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

                {/* Purchased Products */}
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
        )}
      </div>

      {/* Modals */}
      {showNewListForm && <NewListForm />}
      {editingList && <EditListForm list={editingList} />}
      {showNewProductForm && <NewProductForm />}
      {editingProduct && <EditProductForm product={editingProduct} />}
    </div>
  )
}
