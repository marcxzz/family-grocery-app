'use client'

import { getCurrentTheme, toggleTheme } from '@/utils/theme';
import { ShoppingCart, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(getCurrentTheme())
  }, [])

  const changeTheme = () => {
    setIsDark(toggleTheme())
  }

  return (
    <div className={`bg-gray-800 border-gray-700 dark:bg-white dark:border-gray-200 border-b px-4 py-4`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <ShoppingCart className={`w-8 h-8 text-blue-400 dark:text-blue-500`} />
          <h1 className={`text-2xl font-bold text-white dark:text-gray-900`}>
            Lista della Spesa
          </h1>
        </div>
        <button
          onClick={() => changeTheme()}
          className={`p-2 rounded-lg bg-gray-700 text-yellow-400 dark:bg-gray-100 dark:text-gray-600 hover:bg-opacity-80`}
        >
          {!isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
