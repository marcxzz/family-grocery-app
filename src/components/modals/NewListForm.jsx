'use client'

import { useState } from 'react';

export default function NewListForm({ isDark, supermarkets, createList, setShowNewListForm }) {
  const [title, setTitle] = useState('');
  const [supermarket, setSupermarket] = useState('');

  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-black/50' : 'bg-gray-600/50'} flex items-center justify-center p-4 z-50`}>
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
  );
}
