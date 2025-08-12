'use client'

import { Plus, ShoppingCart, Edit3, Trash2 } from 'lucide-react';

export default function ListsOverview({ isDark, lists, setCurrentList, setShowNewListForm, setEditingList, deleteList }) {
  return (
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
                      e.stopPropagation();
                      setEditingList(list);
                    }}
                    className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(list.id);
                    }}
                    className={`p-2 rounded-lg ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div onClick={() => setCurrentList(list)} className="space-y-1">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {list.products} prodotti
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {list.purchased} completati
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
