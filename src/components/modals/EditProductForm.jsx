'use client'

import { useState } from 'react';
import { Modal, ModalHeader } from './Modal';

export default function EditProductForm({ isDark, supermarkets, quantityTypes, product, updateProduct, setEditingProduct }) {
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity);
  const [quantityType, setQuantityType] = useState(product.quantityType);
  const [supermarket, setSupermarket] = useState(product.supermarket);
  const [isImportant, setIsImportant] = useState(product.isImportant);

  return (
    <Modal>
      <ModalHeader>Modifica prodotto</ModalHeader>
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
            type="number"
            placeholder="1"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(e.target.value)}
            className={`flex-1 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
          />
          <select
            value={quantityType}
            onChange={(e) => setQuantityType(e.target.value)}
            className={`flex-1 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 outline-none`}
          >
            {quantityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
            <option key={market.id} value={market.name}>{market.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="w-5 h-5 text-red-500"
          />
          <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Urgente/Importante</span>
        </label>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => name && quantity && quantityType && updateProduct(product.id, name, quantity, quantityType, supermarket, isImportant)}
          disabled={!name || !quantity || !quantityType}
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
    </Modal>
  );
}
