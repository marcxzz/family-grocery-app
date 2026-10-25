"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import {
  getBannedProductById,
  getBannedProductByBarcode,
  createBannedProduct,
  updateBannedProduct,
  deleteBannedProduct,
} from "@/dal/bannedProducts";

const BASE_URLS = [
  "https://world.openfoodfacts.org",
  "https://world.openbeautyfacts.org",
  "https://world.openproductsfacts.org",
];

function isVercelBlobUrl(url) {
  return typeof url === "string" && url.includes(".public.blob.vercel-storage.com");
}

/**
 * 1. Controlla se il barcode è già nel DB locale (evita duplicati).
 * 2. Se non c'è, interroga in cascata Open Food / Beauty / Products Facts.
 */
export async function lookupBarcodeAction(rawBarcode) {
  const barcode = String(rawBarcode || "").trim();
  if (!barcode) {
    return { status: "error", message: "Codice a barre non valido" };
  }

  try {
    // Check duplicato su DB Neon
    const existing = await getBannedProductByBarcode(barcode);
    if (existing) {
      return {
        status: "already_banned",
        product: existing,
      };
    }

    // Cascata su Open Facts
    const fields =
      "code,product_name,product_name_it,brands,image_front_url,image_url";

    for (const baseUrl of BASE_URLS) {
      try {
        const res = await fetch(
          `${baseUrl}/api/v2/product/${encodeURIComponent(barcode)}?fields=${fields}`,
          {
            headers: {
              "User-Agent": "FamilyGroceryApp/1.0 (https://vercel.app)",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) continue;
        const data = await res.json();

        if (data.status === 1 && data.product) {
          const p = data.product;
          const name = (p.product_name_it || p.product_name || "").trim();
          const brand = p.brands ? p.brands.split(",")[0].trim() : "";
          const imageUrl = p.image_front_url || p.image_url || null;

          if (name || imageUrl) {
            return {
              status: "found",
              product: {
                barcode,
                name,
                brand,
                imageUrl,
              },
            };
          }
        }
      } catch (err) {
        console.error(`Errore fetch da ${baseUrl}:`, err);
      }
    }

    return {
      status: "not_found",
      product: { barcode, name: "", brand: "", imageUrl: null },
    };
  } catch (error) {
    console.error("Errore durante il lookup del barcode:", error);
    return { status: "error", message: "Errore durante la ricerca del codice" };
  }
}

/**
 * Carica il file WebP (già compresso lato client 1000x1000) su Vercel Blob
 */
export async function uploadProductImageAction(formData) {
  try {
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return { success: false, error: "Nessun file ricevuto" };
    }

    const filename = `banned-products/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.webp`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: "image/webp",
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Errore upload Vercel Blob:", error);
    return {
      success: false,
      error: "Impossibile caricare l'immagine su Vercel Blob",
    };
  }
}

export async function createBannedProductAction(data) {
  try {
    const name = String(data.name || "").trim();
    if (!name) {
      return { success: false, error: "Il nome del prodotto è obbligatorio" };
    }

    const barcode = data.barcode ? String(data.barcode).trim() : null;
    if (barcode) {
      const existing = await getBannedProductByBarcode(barcode);
      if (existing) {
        return {
          success: false,
          error: `Questo codice a barre è già associato a "${existing.name}"`,
        };
      }
    }

    const created = await createBannedProduct({
      barcode,
      name,
      brand: data.brand ? String(data.brand).trim() : null,
      imageUrl: data.imageUrl || null,
      reason: data.reason ? String(data.reason).trim() : null,
      supermarketId: data.supermarketId || null,
    });

    revalidatePath("/");
    return { success: true, data: created };
  } catch (error) {
    console.error("Errore creazione prodotto bannato:", error);
    return { success: false, error: "Errore durante il salvataggio" };
  }
}

export async function updateBannedProductAction(id, data) {
  try {
    const name = String(data.name || "").trim();
    if (!name) {
      return { success: false, error: "Il nome del prodotto è obbligatorio" };
    }

    const previous = await getBannedProductById(id);
    if (!previous) {
      return { success: false, error: "Prodotto non trovato" };
    }

    // Se l'immagine precedente era su Vercel Blob ed è stata cambiata/rimossa, eliminala dal Blob
    if (
      previous.imageUrl &&
      previous.imageUrl !== data.imageUrl &&
      isVercelBlobUrl(previous.imageUrl)
    ) {
      try {
        await del(previous.imageUrl);
      } catch (blobErr) {
        console.error("Errore pulizia vecchio blob:", blobErr);
      }
    }

    const updated = await updateBannedProduct(id, {
      barcode: data.barcode ? String(data.barcode).trim() : null,
      name,
      brand: data.brand ? String(data.brand).trim() : null,
      imageUrl: data.imageUrl || null,
      reason: data.reason ? String(data.reason).trim() : null,
      supermarketId: data.supermarketId || null,
    });

    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Errore modifica prodotto bannato:", error);
    return { success: false, error: "Errore durante l'aggiornamento" };
  }
}

export async function deleteBannedProductAction(id) {
  try {
    const deleted = await deleteBannedProduct(id);

    // Se aveva un'immagine su Vercel Blob, la rimuove dallo storage
    if (deleted?.imageUrl && isVercelBlobUrl(deleted.imageUrl)) {
      try {
        await del(deleted.imageUrl);
      } catch (blobErr) {
        console.error("Errore eliminazione immagine da Vercel Blob:", blobErr);
      }
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Errore eliminazione prodotto bannato:", error);
    return { success: false, error: "Errore durante l'eliminazione" };
  }
}