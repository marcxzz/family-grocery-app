"use server";

import { revalidatePath } from "next/cache";
import * as SupermarketsDAL from "@/dal/supermarkets";

export async function createSupermarketAction(name) {
  try {
    const cleanName = name?.trim();
    if (!cleanName || cleanName.length > 15) {
      return { success: false, error: "Nome obbligatorio (max 15 caratteri)." };
    }
    await SupermarketsDAL.createSupermarket(cleanName);
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore creazione supermercato:", err);
    return { success: false, error: "Impossibile aggiungere il supermercato." };
  }
}

export async function deleteSupermarketAction(id) {
  try {
    await SupermarketsDAL.deleteSupermarket(Number(id));
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Errore eliminazione supermercato:", err);
    return {
      success: false,
      error: "Impossibile eliminare: il supermercato è usato in qualche lista o prodotto.",
    };
  }
}