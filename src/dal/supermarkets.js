import { sql } from "@/db";

export async function getAllSupermarkets() {
  return await sql`
    SELECT id, name 
    FROM "tblSupermarkets" 
    ORDER BY name ASC
  `;
}

export async function createSupermarket(name) {
  const [created] = await sql`
    INSERT INTO "tblSupermarkets" (name)
    VALUES (${name})
    RETURNING id, name
  `;
  return created;
}

export async function deleteSupermarket(id) {
  await sql`
    DELETE FROM "tblSupermarkets" 
    WHERE id = ${id}
  `;
}