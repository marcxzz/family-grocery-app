'use client'

import { useEffect, useState } from 'react';

export default function useGroceryLists() {
  const [isDark, setIsDark] = useState(false);
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [draggedProduct, setDraggedProduct] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const supermarkets = ['Lidl', 'Hardis', 'Carrefour', 'Iperpan', 'Coop', 'Esselunga', 'Conad', 'Altro'];
  const quantityTypes = [
    { value: 'pz', label: 'Pezzi' },
    { value: 'kg', label: 'Chilogrammi' },
    { value: 'g', label: 'Grammi' },
    { value: 'l', label: 'Litri' },
    { value: 'ml', label: 'Millilitri' },
    { value: 'x', label: 'Unità' }
  ];
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('family-grocery-theme');
    setIsDark(storedTheme === 'true');
  }, []);

  const createList = (title, supermarket) => {
    const newList = {
      id: Date.now(),
      title,
      supermarket,
      products: []
    };
    setLists([...lists, newList]);
    setCurrentList(newList);
    setShowNewListForm(false);
  };

  const updateList = (listId, title, supermarket) => {
    const updatedLists = lists.map(list =>
      list.id === listId ? { ...list, title, supermarket } : list
    );
    setLists(updatedLists);
    if (currentList && currentList.id === listId) {
      setCurrentList({ ...currentList, title, supermarket });
    }
    setEditingList(null);
  };

  const deleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    if (currentList && currentList.id === listId) {
      setCurrentList(null);
    }
  };

  const sortProducts = (products) => {
    const unpurchased = products.filter(p => !p.isPurchased);
    const purchased = products.filter(p => p.isPurchased);
    unpurchased.sort((a, b) => {
      if (a.isImportant !== b.isImportant) {
        return b.isImportant ? 1 : -1;
      }
      return 0;
    });
    return [...unpurchased, ...purchased];
  };

  const addProduct = (name, quantity, quantityType, supermarket, isImportant) => {
    const newProduct = {
      id: Date.now(),
      name,
      quantity,
      quantityType,
      supermarket,
      isImportant,
      isPurchased: false
    };
    const updatedList = {
      ...currentList,
      products: sortProducts([...currentList.products, newProduct])
    };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
    setShowNewProductForm(false);
  };

  const updateProduct = (productId, name, quantity, quantityType, supermarket, isImportant) => {
    const updatedProducts = currentList.products.map(product =>
      product.id === productId
        ? { ...product, name, quantity, quantityType, supermarket, isImportant }
        : product
    );
    const updatedList = { ...currentList, products: sortProducts(updatedProducts) };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
    setEditingProduct(null);
  };

  const toggleProductPurchased = (productId) => {
    const updatedProducts = currentList.products.map(product =>
      product.id === productId ? { ...product, isPurchased: !product.isPurchased } : product
    );
    const updatedList = { ...currentList, products: sortProducts(updatedProducts) };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
  };

  const deleteProduct = (productId) => {
    const updatedProducts = currentList.products.filter(product => product.id !== productId);
    const updatedList = { ...currentList, products: updatedProducts };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
  };

  const clearAllProducts = () => {
    const updatedList = { ...currentList, products: [] };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
  };

  const clearPurchasedProducts = () => {
    const updatedProducts = currentList.products.filter(product => !product.isPurchased);
    const updatedList = { ...currentList, products: updatedProducts };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
  };

  const handleDragStart = (e, product, index) => {
    setDraggedProduct({ product, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (!draggedProduct || draggedProduct.index === dropIndex) {
      setDraggedProduct(null);
      return;
    }
    const products = [...currentList.products];
    const unpurchasedProducts = products.filter(p => !p.isPurchased);
    const purchasedProducts = products.filter(p => p.isPurchased);
    if (draggedProduct.product.isPurchased || dropIndex >= unpurchasedProducts.length) {
      setDraggedProduct(null);
      return;
    }
    unpurchasedProducts.splice(draggedProduct.index, 1);
    unpurchasedProducts.splice(dropIndex, 0, draggedProduct.product);
    const reorderedProducts = [...unpurchasedProducts, ...purchasedProducts];
    const updatedList = { ...currentList, products: reorderedProducts };
    setCurrentList(updatedList);
    setLists(lists.map(list => list.id === currentList.id ? updatedList : list));
    setDraggedProduct(null);
  };

  return {
    isDark, setIsDark,
    lists, setLists,
    currentList, setCurrentList,
    showNewListForm, setShowNewListForm,
    showNewProductForm, setShowNewProductForm,
    editingList, setEditingList,
    editingProduct, setEditingProduct,
    draggedProduct, setDraggedProduct,
    dragOverIndex, setDragOverIndex,
    supermarkets, quantityTypes,
    createList, updateList, deleteList,
    addProduct, updateProduct, toggleProductPurchased, deleteProduct,
    clearAllProducts, clearPurchasedProducts,
    handleDragStart, handleDragOver, handleDragLeave, handleDrop
  };
}
