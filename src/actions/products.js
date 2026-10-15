"use server";

import { revalidatePath } from "next/cache";
import * as ProductsDAL from "@/dal/products";

const VALID_UNITS = ["x", "pz", "kg", "g", "L", "ml"];

export async function quickAddProductAction(listId, name) {
  try {
    const cleanName = name?.trim();
    if (!cleanName || cleanName.length > 50) {
      return { success: false, error: "Nome non valido (max 50 caratteri)." };
    }

    await ProductsDAL.createProduct({
      name: cleanName,
      quantity: 1,
      quantityType: "x",
      isImportant: false,
      supermarketId: null,
      listId: Number(listId),
    });

    revalidatePath(`/${listId}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore quick add:", err);
    return { success: false, error: "Prodotto non inserito. Verifica la connessione." };
  }
}

export async function saveProductAction(listId, productId, payload) {
  try {
    const name = payload.name?.trim();
    const quantity = Number(payload.quantity);
    const quantityType = payload.quantityType;
    const isImportant = Boolean(payload.isImportant);
    const supermarketId =
      payload.supermarketId && payload.supermarketId !== "none"
        ? Number(payload.supermarketId)
        : null;

    if (!name || name.length > 50) {
      return { success: false, error: "Nome prodotto non valido (max 50 caratteri)." };
    }
    if (isNaN(quantity) || quantity <= 0 || quantity >= 100) {
      return { success: false, error: "Quantità non valida (tra 0.01 e 99.99)." };
    }
    if (!VALID_UNITS.includes(quantityType)) {
      return { success: false, error: "Unità di misura non valida." };
    }

    if (productId) {
      await ProductsDAL.updateProduct(Number(productId), {
        name,
        quantity,
        quantityType,
        isImportant,
        supermarketId,
      });
    } else {
      await ProductsDAL.createProduct({
        name,
        quantity,
        quantityType,
        isImportant,
        supermarketId,
        listId: Number(listId),
      });
    }

    revalidatePath(`/${listId}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore salvataggio prodotto:", err);
    return { success: false, error: "Impossibile salvare il prodotto." };
  }
}

export async function toggleProductAction(listId, productId, isPurchased) {
  try {
    await ProductsDAL.toggleProductPurchased(Number(productId), Boolean(isPurchased));
    revalidatePath(`/${listId}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore toggle prodotto:", err);
    return { success: false, error: "Impossibile aggiornare lo stato del prodotto." };
  }
}

export async function deleteProductAction(listId, productId) {
  try {
    await ProductsDAL.deleteProduct(Number(productId));
    revalidatePath(`/${listId}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore eliminazione prodotto:", err);
    return { success: false, error: "Impossibile eliminare il prodotto." };
  }
}

export async function clearPurchasedAction(listId) {
  try {
    await ProductsDAL.deletePurchasedProductsByList(Number(listId));
    revalidatePath(`/${listId}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore pulizia acquistati:", err);
    return { success: false, error: "Errore durante la rimozione dei prodotti acquistati." };
  }
}