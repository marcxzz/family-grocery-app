import './../../public/css/globals.css'
import { Inter } from "next/font/google"

import Header from "@/components/common/Header";

const inter = Inter({
  subsets: ['latin']
})

export const metadata = {
  title: "Liste della spesa",
  description: "Gestore delle liste della spesa",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div className="min-h-screen transition-colors bg-gray-900 dark:bg-gray-50">
          <Header />
    
          <div className="max-w-4xl mx-auto p-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
