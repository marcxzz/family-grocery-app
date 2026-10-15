"use server";

import { revalidatePath } from "next/cache";
import * as ListsDAL from "@/dal/lists";

export async function createListAction(formData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const rawSupermarket = formData.get("supermarketId")?.toString();
    const supermarketId =
      rawSupermarket && rawSupermarket !== "none" ? Number(rawSupermarket) : null;

    if (!name || name.length > 30) {
      return { success: false, error: "Il nome è obbligatorio (max 30 caratteri)." };
    }

    await ListsDAL.createList({ name, supermarketId });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore creazione lista:", err);
    return { success: false, error: "Impossibile creare la lista. Riprova." };
  }
}

export async function updateListAction(id, formData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const rawSupermarket = formData.get("supermarketId")?.toString();
    const supermarketId =
      rawSupermarket && rawSupermarket !== "none" ? Number(rawSupermarket) : null;

    if (!name || name.length > 30) {
      return { success: false, error: "Il nome è obbligatorio (max 30 caratteri)." };
    }

    await ListsDAL.updateList(Number(id), { name, supermarketId });
    revalidatePath("/");
    revalidatePath(`/${id}`);
    return { success: true };
  } catch (err) {
    console.error("Errore modifica lista:", err);
    return { success: false, error: "Impossibile aggiornare la lista." };
  }
}

export async function deleteListAction(id) {
  try {
    await ListsDAL.deleteList(Number(id));
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore eliminazione lista:", err);
    return { success: false, error: "Errore durante l'eliminazione della lista." };
  }
}