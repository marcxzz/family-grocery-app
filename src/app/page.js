import { getAllLists } from "@/dal/lists";
import { getAllSupermarkets } from "@/dal/supermarkets";
import { getAllBannedProducts } from "@/dal/bannedProducts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ban, ListTodo } from "lucide-react";
import ListsSection from "@/components/lists/ListsSection";
import { BannedProductsSection } from "@/components/banned/BannedProductsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lists, supermarkets, bannedProducts] = await Promise.all([
    getAllLists(),
    getAllSupermarkets(),
    getAllBannedProducts(),
  ]);

  // console.log({ lists, supermarkets, bannedProducts })

  return (
    <Tabs defaultValue="lists" className="w-full gap-4">
      <TabsList className="mx-auto">
        <TabsTrigger value="lists">
          <ListTodo />
          Liste{" "}({lists.length})
        </TabsTrigger>
        <TabsTrigger value="banned">
          <Ban />
          Prodotti bannati{" "}({bannedProducts.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="lists">
        <ListsSection
          lists={lists}
          supermarkets={supermarkets}
        />
      </TabsContent>
      <TabsContent value="banned">
        <BannedProductsSection
          bannedProducts={bannedProducts}
          supermarkets={supermarkets}
        />
      </TabsContent>
    </Tabs>

  );
}