"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListFormDialog } from "./ListFormDialog";

export function CreateListButton({ supermarkets }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1.5">
        <Plus className="h-4 w-4" />
        Nuova Lista
      </Button>
      <ListFormDialog
        open={open}
        onOpenChange={setOpen}
        supermarkets={supermarkets}
      />
    </>
  );
}