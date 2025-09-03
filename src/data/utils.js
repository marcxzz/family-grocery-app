'use server'

import { neon } from '@neondatabase/serverless'
import { getQtyTypes, getSupermarkets } from './queries/utils'

export async function GetSupermarkets() {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(getSupermarkets)
    // console.log('supermarkets:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function GetQtyTypes() {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const res = await sql.query(getQtyTypes)
    // console.log('quantity types:', res)
    return res
  } catch (err) {
    console.error(err)
    return null
  }
}