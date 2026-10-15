"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Store, Pencil, Trash2, Loader2 } from "lucide-react";
import { toggleProductAction, deleteProductAction } from "@/actions/products";
import { ProductFormDialog } from "./ProductFormDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ProductRow({ product, listId, supermarkets }) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleToggle(checked) {
    setIsToggling(true);
    const res = await toggleProductAction(listId, product.id, checked);
    setIsToggling(false);

    if (!res.success) {
      toast.error(res.error);
    }
  }

  async function handleConfirmDelete(e) {
    e.preventDefault();
    setIsDeleting(true);
    const res = await deleteProductAction(listId, product.id);
    setIsDeleting(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success("Prodotto rimosso");
    setDeleteOpen(false);
  }

  return (
    <>
      <div
        className={`flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors
          ${product.isPurchased ? "bg-muted/40 opacity-60" : "bg-card"}
          ${product.isImportant ? "border-red-600" : ""}
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
          ) : (
            <Checkbox
              checked={product.isPurchased}
              onCheckedChange={handleToggle}
              className="h-5 w-5 shrink-0 rounded-sm"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-0.5 flex-wrap">
              <span
                className={`font-medium break-words ${product.isPurchased ? "line-through text-muted-foreground" : ""
                  }`}
              >
                {product.name}
              </span>

              <div className="inline-flex gap-2 items-center text-xs font-normal">
                {Number(product.quantity)} {product.quantityType}

                {product.supermarketName && (
                  <>
                    <span className="opacity-35">{"–"}</span>
                    <span>
                      {product.supermarketName}
                    </span>
                  </>
                )}
              </div>
              {/* <Badge variant="outline" className="text-xs font-normal">
                {Number(product.quantity)} {product.quantityType}
              </Badge> */}

              {/* {product.isImportant && !product.isPurchased && (
                <Badge variant="destructive" className="gap-1 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  Urgente
                </Badge>
              )} */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEditOpen(true)}
            title="Modifica prodotto"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeleteOpen(true)}
            title="Elimina prodotto"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <ProductFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        listId={listId}
        product={product}
        supermarkets={supermarkets}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rimuovere &ldquo;{product.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Il prodotto verrà eliminato dalla lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}