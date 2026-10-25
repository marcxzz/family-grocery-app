"use client";

import { Store, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BannedProductCard({ product, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="w-full text-left flex items-center gap-3.5 rounded-xl border bg-card p-3 text-card-foreground shadow-2xs transition-colors hover:bg-accent/40 active:bg-accent/60"
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff className="h-5 w-5 text-muted-foreground opacity-50" />
        )}
      </div>

      {/* Contenuto */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-medium text-sm leading-tight truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-3">
          {product.brand && (
            <p className="text-xs text-muted-foreground truncate">
              {product.brand}
            </p>
          )}
          {product.supermarketName && (
            <Badge
              variant="secondary"
              className="shrink-0 text-[11px] px-1.5 py-0 h-5"
            >
              <Store className="h-2.5 w-2.5 mr-1" />
              {product.supermarketName}
            </Badge>
          )}
        </div>

        {product.reason && (
          <p className="text-xs text-destructive/90 line-clamp-1">
            {product.reason}
          </p>
        )}
      </div>
    </button>
  );
}