import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Store } from "lucide-react";
import { getListById } from "@/dal/lists";
import { getProductsByListId } from "@/dal/products";
import { getAllSupermarkets } from "@/dal/supermarkets";
import { QuickAddBar } from "@/components/products/QuickAddBar";
import { ProductRow } from "@/components/products/ProductRow";
import { ClearPurchasedButton } from "@/components/products/ClearPurchasedButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function ListDetailPage({ params }) {
  const { listId } = await params;
  const numericId = Number(listId);

  if (isNaN(numericId)) notFound();

  const [list, products, supermarkets] = await Promise.all([
    getListById(numericId),
    getProductsByListId(numericId),
    getAllSupermarkets(),
  ]);

  if (!list) notFound();

  const toBuy = products.filter((p) => !p.isPurchased);
  const purchased = products.filter((p) => p.isPurchased);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-3">
        <Button
          variant="ghost" className="p-0" size="sm"
          nativeButton={false}
          render={
            <Link href="/">
              <ArrowLeft className="size-4" />
              Torna alle liste
            </Link>
          }
        />
        <div className="flex flex-col items-start gap-0.5 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">{list.name}</h1>
          {list.supermarketName && (
            <Badge variant="secondary" className="gap-1">
              <Store className="h-3.5 w-3.5" />
              {list.supermarketName}
            </Badge>
          )}
        </div>
      </div>

      <QuickAddBar listId={list.id} supermarkets={supermarkets} />

      {/* TODO(#4): add search bar */}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Da comprare ({toBuy.length})
        </h2>

        {toBuy.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Nessun prodotto da acquistare.
          </p>
        ) : (
          <div className="space-y-2">
            {toBuy.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                listId={list.id}
                supermarkets={supermarkets}
              />
            ))}
          </div>
        )}
      </div>

      {purchased.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Nel carrello ({purchased.length})
              </h2>
              <ClearPurchasedButton listId={list.id} count={purchased.length} />
            </div>

            <div className="space-y-2">
              {purchased.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  listId={list.id}
                  supermarkets={supermarkets}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}