import { sql } from "@/db";

export async function getAllLists() {
  return await sql`
    SELECT 
      l.id, 
      l.name, 
      l."supermarketId",
      s.name AS "supermarketName",
      COUNT(p.id)::int AS "totalProducts",
      COUNT(p.id) FILTER (WHERE p."isPurchased" = true)::int AS "purchasedProducts"
    FROM "tblLists" l
    LEFT JOIN "tblSupermarkets" s ON l."supermarketId" = s.id
    LEFT JOIN "tblProducts" p ON l.id = p."listId"
    GROUP BY l.id, s.name
    ORDER BY l.id
  `;
}

export async function getListById(id) {
  const [list] = await sql`
    SELECT 
      l.id, 
      l.name, 
      l."supermarketId",
      s.name AS "supermarketName"
    FROM "tblLists" l
    LEFT JOIN "tblSupermarkets" s ON l."supermarketId" = s.id
    WHERE l.id = ${id}
  `;
  return list || null;
}

export async function createList({ name, supermarketId }) {
  const [created] = await sql`
    INSERT INTO "tblLists" (name, "supermarketId")
    VALUES (${name}, ${supermarketId || null})
    RETURNING id, name, "supermarketId"
  `;
  return created;
}

export async function updateList(id, { name, supermarketId }) {
  const [updated] = await sql`
    UPDATE "tblLists"
    SET name = ${name}, "supermarketId" = ${supermarketId || null}
    WHERE id = ${id}
    RETURNING id, name, "supermarketId"
  `;
  return updated;
}

export async function deleteList(id) {
  // Elimina prima i prodotti associati se la FK non ha ON DELETE CASCADE
  await sql`DELETE FROM "tblProducts" WHERE "listId" = ${id}`;
  await sql`DELETE FROM "tblLists" WHERE id = ${id}`;
}