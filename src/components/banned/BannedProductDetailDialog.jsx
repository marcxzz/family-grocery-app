"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Store,
  Barcode,
  Pencil,
  Trash2,
  ImageOff,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteBannedProductAction } from "@/actions/bannedProducts";

export function BannedProductDetailDialog({
  product,
  open,
  onOpenChange,
  onEdit,
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await deleteBannedProductAction(product.id);
      if (!res.success) {
        toast.error(res.error || "Errore durante l'eliminazione");
        return;
      }
      toast.success("Prodotto rimosso dalla lista nera");
      setConfirmDeleteOpen(false);
      onOpenChange(false);
    } catch {
      toast.error("Errore imprevisto durante l'eliminazione");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="leading-snug">{product.name}</DialogTitle>
            {product?.brand && (
              <DialogDescription>
                {product.brand}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Immagine grande */}
          <div className="relative flex h-60 w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/30 p-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <ImageOff className="h-10 w-10 opacity-40" />
                <span className="text-xs">Nessuna immagine disponibile</span>
              </div>
            )}
          </div>

          {/* Info & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {product.supermarketName && (
                <Badge variant="secondary" className="gap-1">
                  <Store className="h-3 w-3" />
                  {product.supermarketName}
                </Badge>
              )}
              {product.barcode && (
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  <Barcode className="h-3 w-3" />
                  {product.barcode}
                </Badge>
              )}
            </div>

            {/* Motivo del ban */}
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                Motivo del ban
              </div>
              <p className="text-sm text-foreground whitespace-pre-line">
                {product.reason || "Nessun motivo specificato."}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              // size="sm"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Elimina
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                // size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit?.(product);
                }}
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Modifica
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog conferma eliminazione */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rimuovere dai prodotti bannati?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare <strong>{product.name}</strong> dalla lista dei
              prodotti bannati. L&apos;azione rimuoverà anche l&apos;eventuale foto
              salvata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Conferma eliminazione"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}