import { sql } from "@/db";

export async function getProductsByListId(listId) {
  return await sql`
    SELECT 
      p.id,
      p.name,
      p.quantity AS quantity,
      p."quantityType",
      p."isImportant",
      p."isPurchased",
      p."supermarketId",
      p."listId",
      s.name AS "supermarketName"
    FROM "tblProducts" p
    LEFT JOIN "tblSupermarkets" s ON p."supermarketId" = s.id
    WHERE p."listId" = ${listId}
    ORDER BY p."isPurchased" ASC, p."isImportant" DESC, p.id ASC
  `;
}

export async function createProduct({
  name,
  quantity = 1,
  quantityType = "x",
  isImportant = false,
  supermarketId = null,
  listId,
}) {
  const [created] = await sql`
    INSERT INTO "tblProducts" (
      name, quantity, "quantityType", "isImportant", "isPurchased", "supermarketId", "listId"
    )
    VALUES (
      ${name}, ${quantity}, ${quantityType}, ${isImportant}, false, ${supermarketId || null}, ${listId}
    )
    RETURNING id
  `;
  return created;
}

export async function updateProduct(
  id,
  { name, quantity, quantityType, isImportant, supermarketId }
) {
  const [updated] = await sql`
    UPDATE "tblProducts"
    SET 
      name = ${name},
      quantity = ${quantity},
      "quantityType" = ${quantityType},
      "isImportant" = ${isImportant},
      "supermarketId" = ${supermarketId || null}
    WHERE id = ${id}
    RETURNING id
  `;
  return updated;
}

export async function toggleProductPurchased(id, isPurchased) {
  const [updated] = await sql`
    UPDATE "tblProducts"
    SET "isPurchased" = ${isPurchased}
    WHERE id = ${id}
    RETURNING id, "isPurchased"
  `;
  return updated;
}

export async function deleteProduct(id) {
  await sql`DELETE FROM "tblProducts" WHERE id = ${id}`;
}

export async function deletePurchasedProductsByList(listId) {
  await sql`
    DELETE FROM "tblProducts" 
    WHERE "listId" = ${listId} AND "isPurchased" = true
  `;
}

export async function deleteAllProductsByList(listId) {
  await sql`
    DELETE FROM "tblProducts" 
    WHERE "listId" = ${listId}
  `;
}