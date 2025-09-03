'use client'

import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import NewProductForm from '../modals/NewProductForm'
import EditProductForm from '../modals/EditProductForm'
import { useState } from 'react'
import ProductsSection from './ProductsSection'
import { CreateProduct, DeleteAllProducts, DeleteProduct, DeletePurchasedProducts, ToggleProduct } from '@/data/products'

export default function CurrentListView({ currentList: currentListParam, supermarkets }) {
  const [currentList, setCurrentList] = useState(currentListParam)
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [draggedProduct, setDraggedProduct] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const qtyTypes = ['pz', 'kg', 'g', 'L', 'ml', 'x']

  
  const sortProducts = (products) => {
    const unpurchased = products.filter(p => !p.isPurchased)
    const purchased = products.filter(p => p.isPurchased)
    unpurchased.sort((a, b) => {
      if (a.isImportant !== b.isImportant) {
        return b.isImportant ? 1 : -1
      }
      return 0
    })
    return [...unpurchased, ...purchased]
  }

  const addProduct = async (name, quantity, quantityType, supermarket, isImportant) => {
    // console.log('list', currentList)
    const supermarketId = supermarkets.find(s => s.name == supermarket)?.id
    console.log(supermarketId)
    const res = await CreateProduct(name, quantity, quantityType, isImportant, supermarketId, currentList.id)
    if (res) {
      const product = res[0]
      const newProduct = {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        quantityType: product.quantityType,
        supermarketId: product.supermarketId,
        isImportant: product.isImportant,
        isPurchased: product.isPurchased
      }
      const updatedList = {
        ...currentList,
        products: sortProducts([...currentList.products, newProduct])
      }
      setCurrentList(updatedList)
      setShowNewProductForm(false)
    }
  }

  const updateProduct = (productId, name, quantity, quantityType, supermarket, isImportant) => {
    const updatedProducts = currentList.products.map(product =>
      product.id === productId
        ? { ...product, name, quantity, quantityType, supermarket, isImportant }
        : product
    )
    const updatedList = { ...currentList, products: sortProducts(updatedProducts) }
    setCurrentList(updatedList)
    setEditingProduct(null)
  }

  const toggleProductPurchased = async (product) => {
    const newState = !product?.isPurchased
    // console.log(product, newState)
    const res = await ToggleProduct(product.id, newState)
    if (res) {
      const updatedProducts = currentList.products.map(p =>
        p.id === product.id ? { ...p, isPurchased: !p.isPurchased } : p
      )
      const updatedList = { ...currentList, products: sortProducts(updatedProducts) }
      setCurrentList(updatedList)
    }
  }

  const deleteProduct = async (productId) => {    
    const res = await DeleteProduct(productId)
    if (res) {
      const updatedList = {
        ...currentList,
        products: sortProducts(currentList.products.filter(p => p.id !== productId))
      }
      setCurrentList(updatedList)
    }
  }

  const clearAllProducts = async () => {
    const res = await DeleteAllProducts(currentList.id)
    if (res) {
      const updatedList = { ...currentList, products: [] }
      setCurrentList(updatedList)
    }
  }

  const clearPurchasedProducts = async () => {
    const res = await DeletePurchasedProducts(currentList.id)
    if (res) {
    const updatedProducts = currentList.products.filter(product => !product.isPurchased)
    const updatedList = { ...currentList, products: updatedProducts }
    setCurrentList(updatedList)
    }
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
    if (draggedProduct.product.isPurchased || dropIndex >= unpurchasedProducts.length) {
      setDraggedProduct(null)
      return
    }
    unpurchasedProducts.splice(draggedProduct.index, 1)
    unpurchasedProducts.splice(dropIndex, 0, draggedProduct.product)
    const reorderedProducts = [...unpurchasedProducts, ...purchasedProducts]
    const updatedList = { ...currentList, products: reorderedProducts }
    setCurrentList(updatedList)
    setDraggedProduct(null)
  }
  
  return (
    <div className="space-y-6">
      <Link href='/' className={`text-sm text-blue-400 dark:text-blue-500 hover:underline mb-4 flex items-center gap-2`}>
        <ArrowLeft className='size-5' /> Torna alle liste
      </Link>
      <div className="">
        <div className='flex items-center justify-between'>
          <div className="flex flex-col">
            <h2 className={`text-2xl font-semibold text-white dark:text-gray-900`}>
              {currentList.name}
            </h2>
            {currentList.supermarket && (
              <p className={`text-base mt-1 text-gray-400 dark:text-gray-600`}>
                {currentList.supermarket}
              </p>
            )}

          </div>

          <button
            onClick={() => setShowNewProductForm(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Aggiungi
          </button>
        </div>
      </div>

      {currentList?.products.length > 0 ? (
        <ProductsSection
          currentList={currentList}
          toggleProductPurchased={toggleProductPurchased}
          setEditingProduct={setEditingProduct}
          deleteProduct={deleteProduct}
          clearAllProducts={clearAllProducts}
          clearPurchasedProducts={clearPurchasedProducts}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          supermarkets={supermarkets}
        />
      ) : (
        <div className={`text-center py-12 text-gray-400 dark:text-gray-500`}>
          <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Lista vuota</p>
          <p>Aggiungi il primo prodotto alla tua lista!</p>
        </div>
      )}

      {showNewProductForm && (
        <NewProductForm
          addProduct={addProduct}
          currentList={currentList}
          setShowNewProductForm={setShowNewProductForm}
          supermarkets={supermarkets}
          quantityTypes={qtyTypes}
        />
      )}

      {/* {editingProduct && (
        <EditProductForm
          setEditingProduct={setEditingProduct}
          updateProduct={updateProduct}
          supermarkets={supermarkets}
          quantityTypes={qtyTypes}
          product={editingProduct}
        />
      )} */}
    </div>
  )
}
