'use client'

export function Modal({ children }) {
  return (
    <div className={`fixed inset-0 bg-black/50 dark:bg-gray-600/50 flex items-center justify-center p-4 z-50`}>
      <div className={`bg-gray-800 dark:bg-white rounded-2xl p-6 w-full max-w-md`}>
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children }) {
  return (
    <h3 className={`text-lg font-semibold mb-4 text-white dark:text-gray-900`}>
      {children}
    </h3>
  )
}