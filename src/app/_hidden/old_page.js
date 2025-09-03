'use client'

import React from 'react';
import useGroceryLists from '../hooks/useGroceryLists';

import Header from '../components/common/Header';
import ListsOverview from '../components/home/ListsOverview';
import CurrentListView from '../components/current-list/CurrentListView';

import NewListForm from '../components/modals/NewListForm';
import EditListForm from '../components/modals/EditListForm';
import NewProductForm from '../components/modals/NewProductForm';
import EditProductForm from '../components/modals/EditProductForm';

export default function Home() {
  const store = useGroceryLists();

  return (
    <div className={`min-h-screen transition-colors ${store.isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Header */}
      <Header isDark={store.isDark} setIsDark={store.setIsDark} />

      <div className="max-w-4xl mx-auto p-4">
        {/* Lists Overview */}
        {!store.currentList && (
          <ListsOverview
            isDark={store.isDark}
            lists={store.lists}
            setCurrentList={store.setCurrentList}
            setShowNewListForm={store.setShowNewListForm}
            setEditingList={store.setEditingList}
            deleteList={store.deleteList}
          />
        )}

        {/* Current List View */}
        {store.currentList && (
          <CurrentListView
            isDark={store.isDark}
            currentList={store.currentList}
            setCurrentList={store.setCurrentList}
            setShowNewProductForm={store.setShowNewProductForm}
            clearPurchasedProducts={store.clearPurchasedProducts}
            clearAllProducts={store.clearAllProducts}
            handleDragStart={store.handleDragStart}
            handleDragOver={store.handleDragOver}
            handleDragLeave={store.handleDragLeave}
            handleDrop={store.handleDrop}
            dragOverIndex={store.dragOverIndex}
            toggleProductPurchased={store.toggleProductPurchased}
            setEditingProduct={store.setEditingProduct}
            deleteProduct={store.deleteProduct}
          />
        )}
      </div>

      {/* Modals */}
      {store.showNewListForm && (
        <NewListForm
          isDark={store.isDark}
          supermarkets={store.supermarkets}
          createList={store.createList}
          setShowNewListForm={store.setShowNewListForm}
        />
      )}

      {store.editingList && (
        <EditListForm
          isDark={store.isDark}
          list={store.editingList}
          supermarkets={store.supermarkets}
          updateList={store.updateList}
          setEditingList={store.setEditingList}
        />
      )}

      {store.showNewProductForm && (
        <NewProductForm
          isDark={store.isDark}
          supermarkets={store.supermarkets}
          quantityTypes={store.quantityTypes}
          currentList={store.currentList}
          addProduct={store.addProduct}
          setShowNewProductForm={store.setShowNewProductForm}
        />
      )}

      {store.editingProduct && (
        <EditProductForm
          isDark={store.isDark}
          supermarkets={store.supermarkets}
          quantityTypes={store.quantityTypes}
          product={store.editingProduct}
          updateProduct={store.updateProduct}
          setEditingProduct={store.setEditingProduct}
        />
      )}
    </div>
  );
}
