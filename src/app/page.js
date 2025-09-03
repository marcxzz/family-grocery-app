import ListsOverview from "@/components/home/ListsOverview";
import { GetAllLists } from "@/data/lists";
import { GetSupermarkets } from "@/data/utils";

export default async function Home() {
  const lists = await GetAllLists()
  const supermarkets = await GetSupermarkets()

  return (
    <ListsOverview lists={lists} supermarkets={supermarkets} />
  )
}
