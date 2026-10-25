"use client";

import { useState, useMemo } from "react";
import { ScanBarcode, Search, X, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BannedProductCard } from "./BannedProductCard";
import { BannedProductFormDialog } from "./BannedProductFormDialog";
import { BannedProductDetailDialog } from "./BannedProductDetailDialog";

export function BannedProductsSection({
  bannedProducts = [],
  supermarkets = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupermarket, setSelectedSupermarket] = useState("all");

  // Stati Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return bannedProducts.filter((item) => {
      const matchesSupermarket =
        selectedSupermarket === "all" ||
        String(item.supermarketId) === String(selectedSupermarket);

      if (!matchesSupermarket) return false;
      if (!q) return true;

      const matchName = item.name?.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q);
      const matchBarcode = item.barcode?.toLowerCase().includes(q);
      const matchReason = item.reason?.toLowerCase().includes(q);

      return matchName || matchBrand || matchBarcode || matchReason;
    });
  }, [bannedProducts, searchQuery, selectedSupermarket]);

  return (
    <div className="space-y-6">
      {/* Intestazione + CTA Scanner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Prodotti Bannati</h1>
          <p className="text-sm text-muted-foreground">
            Prodotti da evitare quando fai la spesa
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="ml-auto">
          <ScanBarcode className="h-4 w-4 mr-1.5" />
          Scansiona prodotto
        </Button>
      </div>

      {/* Search bar + Filtri rapidi per Supermercato */}
      {bannedProducts.length > 0 && (
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cerca per nome, marca, motivo o codice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {supermarkets.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <Button
                type="button"
                variant={selectedSupermarket === "all" ? "default" : "outline"}
                size="sm"
                className="h-7 rounded-full px-3 text-xs shrink-0"
                onClick={() => setSelectedSupermarket("all")}
              >
                Tutti ({bannedProducts.length})
              </Button>
              {supermarkets.map((s) => {
                const count = bannedProducts.filter(
                  (p) => p.supermarketId === s.id
                ).length;
                if (count === 0) return null;

                return (
                  <Button
                    key={s.id}
                    type="button"
                    variant={
                      String(selectedSupermarket) === String(s.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="h-7 rounded-full px-3 text-xs shrink-0"
                    onClick={() => setSelectedSupermarket(String(s.id))}
                  >
                    {s.name} ({count})
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Lista Prodotti Bannati */}
      {bannedProducts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-10 text-center space-y-2">
          <Ban className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h2 className="font-semibold text-base">Nessun prodotto bannato</h2>
          <p className="text-muted-foreground text-sm">Scansiona un codice a barre per aggiungerne uno!</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Nessun prodotto corrisponde ai filtri selezionati.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProducts.map((product) => (
            <BannedProductCard
              key={product.id}
              product={product}
              onClick={(p) => setDetailProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Dialog Creazione / Scansione */}
      <BannedProductFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        supermarkets={supermarkets}
      />

      {/* Dialog Modifica */}
      <BannedProductFormDialog
        open={Boolean(editingProduct)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingProduct(null);
        }}
        supermarkets={supermarkets}
        initialProduct={editingProduct}
      />

      {/* Dialog Dettaglio */}
      <BannedProductDetailDialog
        product={detailProduct}
        open={Boolean(detailProduct)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDetailProduct(null);
        }}
        onEdit={(productToEdit) => setEditingProduct(productToEdit)}
      />
    </div>
  );
}