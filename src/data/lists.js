'use server'

import { neon } from '@neondatabase/serverless'
import { createList, createListNoSupermarket, deleteList, updateList, getLists, updateListNoSupermarket } from './queries/lists'

export async function GetAllLists() {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(getLists)
    // console.log('lists:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function CreateList(name, supermarketId) {
  if (!name) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = supermarketId ? (
      await sql.query(createList, [name, supermarketId])
    ) : (
      await sql.query(createListNoSupermarket, [name])
    )
    // console.log('list created:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function UpdateList(listId, name, supermarketId) {
  if (!listId || !name) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    // console.log('sup' , supermarketId, typeof supermarketId)
    const res = supermarketId ? (
      await sql.query(updateList, [name, supermarketId == '0' ? null : supermarketId, listId])
    ) : (
      await sql.query(updateListNoSupermarket, [name, listId])
    )
    // console.log('list updated:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function DeleteList(listId) {
  if (!listId) return null

  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(deleteList, [listId])
    // console.log('list deleted:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}
