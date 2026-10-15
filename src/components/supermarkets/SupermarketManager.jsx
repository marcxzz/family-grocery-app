"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  createSupermarketAction,
  deleteSupermarketAction,
} from "@/actions/supermarkets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SupermarketManager({ supermarkets }) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAdding(true);
    const res = await createSupermarketAction(name);
    setIsAdding(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    setName("");
    toast.success("Supermercato aggiunto");
  }

  async function handleDelete(id) {
    setDeletingId(id);
    const res = await deleteSupermarketAction(id);
    setDeletingId(null);

    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success("Supermercato rimosso");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Nuovo supermercato (max 15 car.)..."
          maxLength={15}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAdding}
        />
        <Button type="submit" disabled={isAdding || !name.trim()}>
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
          Aggiungi
        </Button>
      </form>

      <div className="space-y-2">
        {supermarkets.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span className="font-medium">{s.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(s.id)}
              disabled={deletingId === s.id}
            >
              {deletingId === s.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}