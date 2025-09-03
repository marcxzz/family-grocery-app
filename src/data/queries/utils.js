export const getSupermarkets = `SELECT * FROM "tblSupermarkets" ORDER BY "id"`

export const getQtyTypes = `SELECT enum_range(NULL::"quantityTypes")`