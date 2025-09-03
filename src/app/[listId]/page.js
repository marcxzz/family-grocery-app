import CurrentListView from "@/components/current-list/CurrentListView"
import { GetListProducts } from "@/data/products"
import { GetQtyTypes, GetSupermarkets } from "@/data/utils"
import { notFound } from "next/navigation"

export default async function ListDetails({ params, searchParams }) {
  const { listId } = await params
  const { name, supermarket } = await searchParams

  const res = await GetListProducts(parseInt(listId))
  if (!res) return notFound()
    
  const supermarkets = await GetSupermarkets()

  const currentList = { id: parseInt(listId), name: name, supermarket: supermarket, products: [...res] }

  return (
    <CurrentListView currentList={currentList} supermarkets={supermarkets} />
  )
}
