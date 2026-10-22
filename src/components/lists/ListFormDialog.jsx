"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createListAction, updateListAction } from "@/actions/lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function ListFormDialog({ open, onOpenChange, list = null, supermarkets = [] }) {
  const isEditing = Boolean(list);
  const [name, setName] = useState(list?.name || "");
  const [supermarketId, setSupermarketId] = useState(
    list?.supermarketId ? String(list.supermarketId) : "none"
  );
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("supermarketId", supermarketId);

    const res = isEditing
      ? await updateListAction(list.id, formData)
      : await createListAction(formData);

    setIsPending(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success(isEditing ? "Lista aggiornata" : "Lista creata");
    if (!isEditing) {
      setName("");
      setSupermarketId("none");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifica Lista" : "Nuova Lista"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">Nome della lista</Label>
            <Input
              id="list-name"
              placeholder="Es. Spesa Settimanale"
              maxLength={30}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Supermercato principale (opzionale)</Label>
            <Select
              value={supermarketId}
              onValueChange={setSupermarketId}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Nessun supermercato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuno / Misto</SelectItem>
                {supermarkets.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name} {/* FIXME: #6 supermarket name should be displayed instead of its ID */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {isEditing ? "Salva modifiche" : "Crea lista"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}