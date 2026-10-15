"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2, Ellipsis } from "lucide-react";
import { quickAddProductAction } from "@/actions/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { ButtonGroup } from "@/components/ui/button-group";

export function QuickAddBar({ listId, supermarkets }) {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [fullDialogOpen, setFullDialogOpen] = useState(false);

  async function handleQuickAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsPending(true);
    const res = await quickAddProductAction(listId, name);
    setIsPending(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    setName("");
    toast.success("Prodotto aggiunto");
  }

  return (
    <>
      <form onSubmit={handleQuickAdd} className="flex gap-1">
        <Input
          placeholder="Aggiungi rapido (es. Latte)..."
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="flex-1 h-9"
        />

        <ButtonGroup>
          <Button type="submit" disabled={isPending || !name.trim()} title="Aggiungi rapido (1x)">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setFullDialogOpen(true)}
            className="gap-1.5 shrink-0"
          >
            {/* <SlidersHorizontal className="h-4 w-4" /> */}
            <Ellipsis className="h-4 w-4" />
            <span className="hidden sm:inline">Dettagli</span>
          </Button>
        </ButtonGroup>
      </form>

      <ProductFormDialog
        open={fullDialogOpen}
        onOpenChange={setFullDialogOpen}
        listId={listId}
        supermarkets={supermarkets}
        initialName={name}
        onSuccess={() => setName("")}
      />
    </>
  );
}