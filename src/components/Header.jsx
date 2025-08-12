'use client'

import { ShoppingCart, Moon, Sun } from 'lucide-react';

export default function Header({ isDark, setIsDark }) {
  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-4`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <ShoppingCart className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Lista della Spesa
          </h1>
        </div>
        <button
          onClick={() => setIsDark(() => {
            const newTheme = !isDark
            localStorage.setItem('family-grocery-theme', newTheme)
            return newTheme
          })}
          className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
