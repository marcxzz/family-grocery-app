"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  ScanBarcode,
  Search,
  Upload,
  Loader2,
  ArrowLeft,
  ImageOff,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarcodeScanner } from "./BarcodeScanner";
import { compressImageToWebP } from "@/lib/imageUtils";
import {
  lookupBarcodeAction,
  uploadProductImageAction,
  createBannedProductAction,
  updateBannedProductAction,
} from "@/actions/bannedProducts";

export function BannedProductFormDialog({
  open,
  onOpenChange,
  supermarkets = [],
  initialProduct = null, // Se presente, siamo in modalità "Modifica"
  onSaved,
}) {
  const isEditing = Boolean(initialProduct?.id);

  // "scan" | "form"
  const [step, setStep] = useState(isEditing ? "form" : "scan");
  const [manualBarcode, setManualBarcode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Campi Form
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [supermarketId, setSupermarketId] = useState("");
  const [reason, setReason] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (initialProduct) {
        setStep("form");
        setBarcode(initialProduct.barcode || "");
        setName(initialProduct.name || "");
        setBrand(initialProduct.brand || "");
        setImageUrl(initialProduct.imageUrl || "");
        setSupermarketId(
          initialProduct.supermarketId ? String(initialProduct.supermarketId) : ""
        );
        setReason(initialProduct.reason || "");
      } else {
        setStep("scan");
        setManualBarcode("");
        setBarcode("");
        setName("");
        setBrand("");
        setImageUrl("");
        setSupermarketId("");
        setReason("");
      }
    }
  }, [open, initialProduct]);

  async function handleBarcodeLookup(codeToSearch) {
    const cleanCode = String(codeToSearch || "").trim();
    if (!cleanCode) return;

    setIsLookingUp(true);
    try {
      const res = await lookupBarcodeAction(cleanCode);

      if (res.status === "already_banned") {
        toast.warning(
          `Questo prodotto è già bannato: "${res.product.name}"`
        );
        setBarcode(res.product.barcode || cleanCode);
        setName(res.product.name || "");
        setBrand(res.product.brand || "");
        setImageUrl(res.product.imageUrl || "");
        setSupermarketId(
          res.product.supermarketId ? String(res.product.supermarketId) : ""
        );
        setReason(res.product.reason || "");
        setStep("form");
        return;
      }

      if (res.status === "found") {
        toast.success("Prodotto trovato nel database Open Facts!");
        setBarcode(cleanCode);
        setName(res.product.name || "");
        setBrand(res.product.brand || "");
        setImageUrl(res.product.imageUrl || "");
        setStep("form");
        return;
      }

      // Non trovato: passa al form manuale col barcode precompilato
      toast.info(
        "Codice non presente su Open Facts. Inserisci i dati manualmente."
      );
      setBarcode(cleanCode);
      setName("");
      setBrand("");
      setImageUrl("");
      setStep("form");
    } catch {
      toast.error("Errore durante la verifica del codice a barre");
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // 1. Comprimi lato client a max 1000x1000 in formato WebP
      const compressedWebP = await compressImageToWebP(file, 1000, 0.82);

      // 2. Carica su Vercel Blob
      const formData = new FormData();
      formData.append("file", compressedWebP);

      const res = await uploadProductImageAction(formData);
      if (!res.success) {
        toast.error(res.error || "Errore durante il caricamento della foto");
        return;
      }

      setImageUrl(res.url);
      toast.success("Immagine ottimizzata e caricata!");
    } catch (err) {
      console.error(err);
      toast.error("Errore durante l'elaborazione dell'immagine");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Inserisci il nome del prodotto");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        barcode: barcode.trim() || null,
        name: name.trim(),
        brand: brand.trim() || null,
        imageUrl: imageUrl || null,
        supermarketId: supermarketId ? Number(supermarketId) : null,
        reason: reason.trim() || null,
      };

      const res = isEditing
        ? await updateBannedProductAction(initialProduct.id, payload)
        : await createBannedProductAction(payload);

      if (!res.success) {
        toast.error(res.error || "Operazione fallita");
        return;
      }

      toast.success(
        isEditing
          ? "Prodotto bannato aggiornato"
          : "Prodotto aggiunto alla lista nera"
      );
      onSaved?.(res.data);
      onOpenChange(false);
    } catch {
      toast.error("Errore imprevisto durante il salvataggio");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Modifica prodotto bannato"
              : step === "scan"
                ? "Scansiona codice a barre"
                : "Conferma dati prodotto"}
          </DialogTitle>
          <DialogDescription>
            {step === "scan"
              ? "Inquadra il codice a barre o inseriscilo manualmente."
              : "Verifica le informazioni del prodotto da bannare."}
          </DialogDescription>
        </DialogHeader>

        {step === "scan" ? (
          <div className="space-y-4">
            {isLookingUp ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border p-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">
                  Ricerca prodotto su Open Facts...
                </p>
              </div>
            ) : (
              <BarcodeScanner onDetected={handleBarcodeLookup} />
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBarcodeLookup(manualBarcode);
              }}
              className="space-y-2"
            >
              <Label htmlFor="manual-barcode">
                Oppure digita il codice a barre (EAN / UPC)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="manual-barcode"
                  inputMode="numeric"
                  placeholder="Es. 8001120783515"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  disabled={isLookingUp}
                  tabIndex={-1}
                  className="h-9"
                />
                <Button
                  type="submit"
                  // variant="secondary"
                  disabled={!manualBarcode.trim() || isLookingUp}
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  Cerca
                </Button>
              </div>
            </form>

            <div className="pt-2 border-t text-center space-y-2">
              <p className="text-muted-foreground">oppure</p>

              <Button
                type="button"
                variant="secondary"
                // size="sm"
                className="w-full"
                onClick={() => setStep("form")}
                disabled={isLookingUp}
              >
                Inserisci prodotto a mano
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-mt-2 h-8 px-2 text-xs text-muted-foreground"
                onClick={() => setStep("scan")}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Torna allo scanner
              </Button>
            )}

            {/* Sezione Immagine + Upload */}
            <div className="flex items-center gap-4 rounded-lg border p-3 bg-muted/30">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-background flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name || "Anteprima prodotto"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImageOff className="h-7 w-7 text-muted-foreground opacity-50" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="text-xs text-muted-foreground">
                  {imageUrl
                    ? "Immagine prodotto pronta"
                    : "Nessuna foto trovata. Scatta o carica una foto."}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Compressione...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        {imageUrl ? "Cambia foto" : "Scatta / Carica foto"}
                      </>
                    )}
                  </Button>

                  {imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive px-2"
                      onClick={() => setImageUrl("")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Nome Prodotto */}
            <div className="space-y-1.5">
              <Label htmlFor="banned-name">
                Nome prodotto
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="banned-name"
                placeholder="Es. Biscotti frollini al cacao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Brand e Barcode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="banned-brand">Marca / Brand</Label>
                <Input
                  id="banned-brand"
                  placeholder="Es. Mulino Bianco"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="banned-barcode">Codice a barre</Label>
                <Input
                  id="banned-barcode"
                  placeholder="Opzionale"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </div>
            </div>

            {/* Supermercato (Select nativo stilizzato coerente con Tailwind/Shadcn per zero attriti) */}
            <div className="space-y-1.5">
              <Label htmlFor="banned-supermarket">Supermercato di acquisto</Label>
              <select
                id="banned-supermarket"
                value={supermarketId}
                onChange={(e) => setSupermarketId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Tutti / Non specificato</option>
                {supermarkets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Motivo del ban */}
            <div className="space-y-1.5">
              <Label htmlFor="banned-reason">Motivo del ban</Label>
              <textarea
                id="banned-reason"
                rows={3}
                placeholder="Es. Gusto non buono, consistenza gommosa, troppo salato..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex w-full min-h-[75px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={isSaving || isUploadingImage}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Salvataggio...
                  </>
                ) : isEditing ? (
                  "Salva modifiche"
                ) : (
                  <>
                    {/* <ScanBarcode className="h-4 w-4 mr-1.5" /> */}
                    Banna prodotto
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}