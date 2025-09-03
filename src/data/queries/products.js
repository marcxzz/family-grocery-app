export const getListProducts = `SELECT * FROM "tblProducts" WHERE "listId" = $1 ORDER BY "id"`

export const createProductNoSupermarket = `INSERT INTO "tblProducts" ("name", "quantity", "quantityType", "isImportant", "listId") VALUES ($1, $2, $3, $4, $5) RETURNING *`
export const createProduct = `INSERT INTO "tblProducts" ("name", "quantity", "quantityType", "isImportant", "supermarketId", "listId") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`

export const editProduct = ``

export const toggleProduct = `UPDATE "tblProducts" SET "isPurchased" = $1 WHERE "id" = $2 RETURNING *`

export const deleteProduct = `DELETE FROM "tblProducts" WHERE "id" = $1 RETURNING *`

export const deletePurchasedProducts = `DELETE FROM "tblProducts" WHERE "listId" = $1 AND "isPurchased" = TRUE RETURNING *`

export const deleteAllProducts = `DELETE FROM "tblProducts" WHERE "listId" = $1 RETURNING *`