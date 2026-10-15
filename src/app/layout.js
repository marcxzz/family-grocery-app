import "./globals.css";

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  display: "swap",
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata = {
  title: "Liste della Spesa",
  description: "Porta le liste della spesa sempre con te e gestiscile dal tuo smartphone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="mx-auto max-w-2xl p-4">{children}</main>
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}