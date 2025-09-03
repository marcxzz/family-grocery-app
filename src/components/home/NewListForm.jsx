'use client'

import { useState } from 'react';
import { Modal, ModalHeader } from '../modals/Modal';

export default function NewListForm({ supermarkets, createList, setShowNewListForm }) {
  const [title, setTitle] = useState('');
  const [supermarket, setSupermarket] = useState('');

  return (
    <Modal>
      <ModalHeader>Nuova lista</ModalHeader>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome della lista"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white dark:bg-white dark:border-gray-300 dark:text-gray-900 focus:border-blue-500 outline-none`}
        />
        <select
          value={supermarket}
          onChange={(e) => setSupermarket(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 bg-gray-700 border-gray-600 text-white dark:bg-white dark:border-gray-300 dark:text-gray-900 focus:border-blue-500 outline-none`}
        >
          <option value="">Scegli supermercato</option>
          {supermarkets.map(market => (
            <option key={market.id} value={market.id}>{market.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => title && createList(title, supermarket)}
          disabled={!title}
          className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crea Lista
        </button>
        <button
          onClick={() => setShowNewListForm(false)}
          className={`flex-1 bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 p-3 rounded-lg hover:bg-gray-300`}>
          Annulla
        </button>
      </div>
    </Modal>
  );
}
