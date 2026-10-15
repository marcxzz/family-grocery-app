"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingBasket, Sun, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <ShoppingBasket className="h-5 w-5 text-primary" />
          <span>Liste della spesa</span>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon" title="Supermercati"
            nativeButton={false}
            render={
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Impostazioni Supermercati</span>
              </Link>
            }
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            title="Cambia tema"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambia tema</span>
          </Button>
        </div>
      </div>
    </header>
  );
}