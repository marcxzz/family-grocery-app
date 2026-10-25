import { CreateListButton } from "@/components/lists/CreateListButton";
import { ListCard } from "@/components/lists/ListCard";
import { ListTodo } from "lucide-react";

export default function ListsSection({ lists, supermarkets }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Liste</h1>
          <p className="text-sm text-muted-foreground">
            Le tue liste di prodotti da acquistare
          </p>
        </div>
        <CreateListButton supermarkets={supermarkets} />
        {/* TODO(#7): add quick product input */}
      </div>

      {lists.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-10 text-center space-y-2">
          <ListTodo className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h2 className="font-semibold text-base">Non ci sono liste della spesa</h2>
          <p className="text-muted-foreground text-sm">Creane una per iniziare la spesa!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} supermarkets={supermarkets} />
          ))}
        </div>
      )}
    </div>
  )
}
