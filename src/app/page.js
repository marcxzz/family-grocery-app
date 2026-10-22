import { getAllLists } from "@/dal/lists";
import { getAllSupermarkets } from "@/dal/supermarkets";
import { ListCard } from "@/components/lists/ListCard";
import { CreateListButton } from "@/components/lists/CreateListButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lists, supermarkets] = await Promise.all([
    getAllLists(),
    getAllSupermarkets(),
  ]);

  // console.log({ lists, supermarkets })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Le tue Liste</h1>
          <p className="text-sm text-muted-foreground">
            Seleziona una lista o creane una nuova
          </p>
        </div>
        <CreateListButton supermarkets={supermarkets} />
        {/* TODO(#7): add quick product input */}
      </div>

      {lists.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground text-sm">
            Non ci sono ancora liste della spesa. Creane una per iniziare!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} supermarkets={supermarkets} />
          ))}
        </div>
      )}
    </div>
  );
}