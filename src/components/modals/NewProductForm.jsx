'use client'

import { useState } from 'react';

export default function NewProductForm({ isDark, supermarkets, quantityTypes, currentList, addProduct, setShowNewProductForm }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [quantityType, setQuantityType] = useState('x');
  const [supermarket, setSupermarket] = useState(currentList?.supermarket || '');
  const [isImportant, setIsImportant] = useState(false);

  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-black/50' : 'bg-gray-600/50'} flex items-center justify-center p-4 z-50`}>
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
  );
}
