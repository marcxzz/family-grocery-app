"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Store, Pencil, Trash2, Loader2, ChevronRight } from "lucide-react";
import { deleteListAction } from "@/actions/lists";
import { ListFormDialog } from "./ListFormDialog";
import { Card } from "@/components/ui/card";
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

export function ListCard({ list, supermarkets }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(e) {
    e.preventDefault();
    setIsDeleting(true);
    const res = await deleteListAction(list.id);
    setIsDeleting(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success("Lista eliminata");
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className="flex flex-row items-center justify-between p-4 transition-colors hover:bg-accent/40">
        <Link href={`/${list.id}`} className="flex-1 min-w-0 pr-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-semibold text-base truncate">{list.name}</h2>
            {list.supermarketName && (
              <Badge variant="secondary" className="shrink-0 gap-1 text-xs mb-1">
                <Store className="h-3 w-3" />
                {list.supermarketName}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {list.totalProducts === 0
              ? "Nessun prodotto"
              : `${list.purchasedProducts} di ${list.totalProducts} nel carrello`}
          </p>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
            title="Modifica lista"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
            title="Elimina lista"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>

          {/* <Button
            variant="ghost" size="icon"
            nativeButton={false}
            render={
              <Link href={`/${list.id}`}>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            }
          /> */}
        </div>
      </Card>

      <ListFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        list={list}
        supermarkets={supermarkets}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare &ldquo;{list.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà <b>definitivamente</b> la lista e tutti i{" "}
              {list.totalProducts} prodotti al suo interno.
              <br /><br />
              <b>L'azione non può essere annullata</b>.
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