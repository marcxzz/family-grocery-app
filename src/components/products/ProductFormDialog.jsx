"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveProductAction } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UNITS = ["x", "pz", "kg", "g", "L", "ml"];

export function ProductFormDialog({
  open,
  onOpenChange,
  listId,
  product = null,
  supermarkets = [],
  initialName = "",
  onSuccess,
}) {
  const isEditing = Boolean(product);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [quantityType, setQuantityType] = useState("x");
  const [isImportant, setIsImportant] = useState(false);
  const [supermarketId, setSupermarketId] = useState("none");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (open) {
      setName(product?.name ?? initialName ?? "");
      setQuantity(product?.quantity ? String(product.quantity) : "1");
      setQuantityType(product?.quantityType ?? "x");
      setIsImportant(Boolean(product?.isImportant));
      setSupermarketId(product?.supermarketId ? String(product.supermarketId) : "none");
    }
  }, [open, product, initialName]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);

    const res = await saveProductAction(listId, product?.id, {
      name,
      quantity,
      quantityType,
      isImportant,
      supermarketId,
    });

    setIsPending(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success(isEditing ? "Prodotto aggiornato" : "Prodotto aggiunto");
    onSuccess?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Prodotto" : "Aggiungi Prodotto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prod-name">Prodotto</Label>
            <Input
              id="prod-name"
              placeholder="Es. Passata di pomodoro"
              maxLength={50}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="prod-qty">Quantità</Label>
              <Input
                id="prod-qty"
                type="number"
                step="1"
                min="1"
                // max={["g", "ml"].includes(quantityType) ? "999" : "100"}
                max="99"
                required
                value={Number(quantity)}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>Unità</Label>
              <Select
                value={quantityType}
                onValueChange={setQuantityType}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supermercato specifico (opzionale)</Label>
            <Select
              value={supermarketId}
              onValueChange={setSupermarketId}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Qualsiasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Qualsiasi supermercato</SelectItem>
                {supermarkets.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="prod-urgent" className="text-sm font-medium">
                Prodotto Urgente
              </Label>
              <p className="text-xs text-muted-foreground">
                Mette in evidenza il prodotto in cima alla lista
              </p>
            </div>
            <Switch
              id="prod-urgent"
              checked={isImportant}
              onCheckedChange={setIsImportant}
              disabled={isPending}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salva" : "Aggiungi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}