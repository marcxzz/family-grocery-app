'use server'

import { neon } from '@neondatabase/serverless'
import { createProduct, createProductNoSupermarket, deleteAllProducts, deleteProduct, deletePurchasedProducts, getListProducts, toggleProduct } from './queries/products'

export async function GetListProducts(listId) {
  if (!listId) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(getListProducts, [listId])
    // console.log('products:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function CreateProduct(name, qty, qtyType, isImportant, supermarketId, listId) {
  // console.log(name, qty, qtyType, isImportant, {'sup': supermarketId}, listId)
  if (!name || !qty || !qtyType || !listId) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = supermarketId ? (
      await sql.query(createProduct, [name, qty, qtyType, isImportant, supermarketId, listId])
    ) : (
      await sql.query(createProductNoSupermarket, [name, qty, qtyType, isImportant, listId])
    )
    console.log('product created:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

// export async function EditProduct(name, qty, qtyType, isImportant, supermarketId, listId) {
//   // console.log(name, qty, qtyType, isImportant, {'sup': supermarketId}, listId)
//   if (!name || !qty || !qtyType || !listId) return null

//   try {
//     const sql = neon(process.env.DATABASE_URL)
//     const res = supermarketId ? (
//       await sql.query(createProduct, [name, qty, qtyType, isImportant, supermarketId, listId])
//     ) : (
//       await sql.query(createProductNoSupermarket, [name, qty, qtyType, isImportant, listId])
//     )
//     console.log('product created:', res)
//     return res
//   } catch (err) {
//     console.error(err)
//     return null
//   }
// }

export async function ToggleProduct(productId, isPurchased) {
  if (!productId || typeof isPurchased != 'boolean') return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(toggleProduct, [isPurchased, productId])
    console.log('product toggled:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function DeleteProduct(productId) {
  if (!productId) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(deleteProduct, [productId])
    console.log('product deleted:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function DeletePurchasedProducts(listId) {
  if (!listId) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(deletePurchasedProducts, [listId])
    console.log('deleted purchased products:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function DeleteAllProducts(listId) {
  if (!listId) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(deleteAllProducts, [listId])
    console.log('deleted all products:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}
