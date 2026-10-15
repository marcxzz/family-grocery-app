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
import { Label } from "@/components/ui/label";

const NAME_MAX_LENGHT = 15

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
        <div className="flex flex-col items-start gap-1.5">
          <Input
            placeholder="Nome supermercato"
            maxLength={NAME_MAX_LENGHT}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAdding}
            className="h-9"
          />
          <Label className={`pl-0.5 ${name.length > NAME_MAX_LENGHT ? "text-destructive" : "text-muted-foreground"}`}>
            {name.length}/{NAME_MAX_LENGHT} caratteri
          </Label>
        </div>
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
            {/* TODO: add edit button */}
            {/* TODO: add delete confirm dialog */}
            {/* IDEA: add supermarket sorting editing (change order in dropdowns) */}
          </div>
        ))}
      </div>
    </div>
  );
}