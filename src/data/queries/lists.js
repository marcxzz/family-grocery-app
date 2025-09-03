export const getLists = `
  SELECT
    l.*,
    COUNT(p.id) AS "totalProducts",
    COUNT(p.id) FILTER (WHERE p."isPurchased" = true) AS "purchasedProducts",
    s.name AS "supermarket"
  FROM "tblLists" l
  LEFT JOIN "tblProducts" p
    ON l.id = p."listId"
  LEFT JOIN "tblSupermarkets" s
    ON l."supermarketId" = s.id
  GROUP BY l.id, s.name
  ORDER BY l.id;
`

export const createListNoSupermarket = `INSERT INTO "tblLists" ("name") VALUES ($1) RETURNING *`
export const createList = `INSERT INTO "tblLists" ("name", "supermarketId") VALUES ($1, $2) RETURNING *`

export const updateListNoSupermarket = `UPDATE "tblLists" SET "name" = $1 WHERE "id" = $2 RETURNING *`
export const updateList = `UPDATE "tblLists" SET "name" = $1, "supermarketId" = $2 WHERE "id" = $3 RETURNING *`

export const deleteList = `DELETE FROM "tblLists" WHERE "id" = $1 RETURNING *`