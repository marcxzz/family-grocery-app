'use client'

import { useState } from 'react';
import { Modal, ModalHeader } from './Modal';

export default function NewProductForm({ supermarkets, quantityTypes, currentList, addProduct, setShowNewProductForm }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quantityType, setQuantityType] = useState('x');
  const [supermarket, setSupermarket] = useState(currentList?.supermarket || '');
  const [isImportant, setIsImportant] = useState(false);

  return (
    <Modal>
      <ModalHeader>Aggiungi prodotto</ModalHeader>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome prodotto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white dark:bg-white dark:border-gray-300 dark:text-gray-900 focus:border-blue-500 outline-none`}
        />
        <div className="flex gap-2">
          <input
            type="number"
            min={0.01}
            max={99.99}
            step={0.5}
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`flex-1 p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white dark:bg-white dark:border-gray-300 dark:text-gray-900 focus:border-blue-500 outline-none`}
          />
          <select
            value={quantityType}
            onChange={(e) => setQuantityType(e.target.value)}
            className={`flex-1 p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white dark:bg-white dark:border-gray-300 dark:text-gray-900 focus:border-blue-500 outline-none`}
          >
            {quantityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <select
          value={supermarket}
          onChange={(e) => setSupermarket(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white dark:bg-white dark:border-gray-300 dark:text-gray-900 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={currentList?.supermarket && (true)}
        >
          <option value="">Scegli supermercato</option>
          {supermarkets.map(market => (
            <option key={market.id} value={market.name}>{market.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="w-5 h-5 text-red-500"
          />
          <span className={`text-white dark:text-gray-900`}>Urgente/Importante</span>
        </label>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowNewProductForm(false)}
          className={`flex-1 bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 p-3 rounded-lg hover:bg-gray-300`}
        >
          Annulla
        </button>
        <button
          onClick={() => name && quantity && quantityType && addProduct(name, quantity, quantityType, supermarket, isImportant)}
          disabled={!name || !quantity || !quantityType}
          className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Aggiungi
        </button>
      </div>
    </Modal>
  );
}
