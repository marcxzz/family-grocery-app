"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { clearPurchasedAction } from "@/actions/products";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ClearPurchasedButton({ listId, count }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleClear(e) {
    e.preventDefault();
    setIsPending(true);
    const res = await clearPurchasedAction(listId);
    setIsPending(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success("Prodotti acquistati rimossi");
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        nativeButton={true}
        render={
          <Button variant="outline" size="sm" className="text-destructive gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            Rimuovi acquistati ({count})
          </Button>
        }>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Svuotare i prodotti nel carrello?</AlertDialogTitle>
          <AlertDialogDescription>
            Verranno eliminati definitivamente i {count} prodotti già spuntati.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Conferma
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}