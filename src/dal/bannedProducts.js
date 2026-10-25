import { sql } from "@/db";

export async function getAllBannedProducts() {
  return await sql`
    SELECT 
      b.id,
      b.barcode,
      b.name,
      b.brand,
      b."imageUrl",
      b.reason,
      b."supermarketId",
      s.name AS "supermarketName",
      b."createdAt"
    FROM "tblBannedProducts" b
    LEFT JOIN "tblSupermarkets" s ON b."supermarketId" = s.id
    ORDER BY b."createdAt" DESC, b.id DESC
  `;
}

export async function getBannedProductById(id) {
  const [product] = await sql`
    SELECT 
      b.id,
      b.barcode,
      b.name,
      b.brand,
      b."imageUrl",
      b.reason,
      b."supermarketId",
      s.name AS "supermarketName"
    FROM "tblBannedProducts" b
    LEFT JOIN "tblSupermarkets" s ON b."supermarketId" = s.id
    WHERE b.id = ${id}
  `;
  return product || null;
}

export async function getBannedProductByBarcode(barcode) {
  if (!barcode) return null;
  const [product] = await sql`
    SELECT 
      b.id,
      b.barcode,
      b.name,
      b.brand,
      b."imageUrl",
      b.reason,
      b."supermarketId",
      s.name AS "supermarketName"
    FROM "tblBannedProducts" b
    LEFT JOIN "tblSupermarkets" s ON b."supermarketId" = s.id
    WHERE b.barcode = ${barcode}
  `;
  return product || null;
}

export async function createBannedProduct({
  barcode,
  name,
  brand,
  imageUrl,
  reason,
  supermarketId,
}) {
  const [created] = await sql`
    INSERT INTO "tblBannedProducts" (
      barcode, name, brand, "imageUrl", reason, "supermarketId"
    )
    VALUES (
      ${barcode || null},
      ${name},
      ${brand || null},
      ${imageUrl || null},
      ${reason || null},
      ${supermarketId ? Number(supermarketId) : null}
    )
    RETURNING *
  `;
  return created;
}

export async function updateBannedProduct(
  id,
  { barcode, name, brand, imageUrl, reason, supermarketId }
) {
  const [updated] = await sql`
    UPDATE "tblBannedProducts"
    SET 
      barcode = ${barcode || null},
      name = ${name},
      brand = ${brand || null},
      "imageUrl" = ${imageUrl || null},
      reason = ${reason || null},
      "supermarketId" = ${supermarketId ? Number(supermarketId) : null}
    WHERE id = ${id}
    RETURNING *
  `;
  return updated;
}

export async function deleteBannedProduct(id) {
  const [deleted] = await sql`
    DELETE FROM "tblBannedProducts"
    WHERE id = ${id}
    RETURNING "imageUrl"
  `;
  return deleted;
}