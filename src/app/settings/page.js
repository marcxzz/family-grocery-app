import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllSupermarkets } from "@/dal/supermarkets";
import { SupermarketManager } from "@/components/supermarkets/SupermarketManager";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supermarkets = await getAllSupermarkets();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost" size="icon" className="-ml-2"
          nativeButton={false}
          render={
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          }
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supermercati</h1>
          <p className="text-sm text-muted-foreground">
            Configura i negozi selezionabili nelle liste e nei prodotti
          </p>
        </div>
      </div>

      <SupermarketManager supermarkets={supermarkets} />
    </div>
  );
}