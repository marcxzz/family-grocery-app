"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CameraOff, Loader2 } from "lucide-react";

export function BarcodeScanner({ onDetected }) {
  const rawId = useId();
  const readerId = `barcode-reader-${rawId.replace(/:/g, "")}`;
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    hasScannedRef.current = false;

    async function startScanner() {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          "html5-qrcode"
        );
        if (!isMounted) return;

        const scanner = new Html5Qrcode(readerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
          ],
          verbose: false,
        });

        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 130 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (hasScannedRef.current) return;
            hasScannedRef.current = true;

            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(80);
            }

            scanner
              .stop()
              .catch(() => {})
              .finally(() => {
                if (isMounted) onDetected(decodedText);
              });
          },
          () => {
            // Frame senza barcode ignorato
          }
        );

        if (isMounted) setIsStarting(false);
      } catch (err) {
        console.error("Camera error:", err);
        if (isMounted) {
          setError(
            "Impossibile accedere alla fotocamera. Verifica i permessi del browser o inserisci il codice manualmente."
          );
          setIsStarting(false);
        }
      }
    }

    startScanner();

    return () => {
      isMounted = false;
      const scanner = scannerRef.current;
      if (scanner && scanner.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [readerId, onDetected]);

  return (
    <div className="relative overflow-hidden rounded-xl border bg-black text-white">
      <div id={readerId} className="w-full min-h-[220px]" />

      {isStarting && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-white/80" />
          <span>Avvio fotocamera...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-white/80">
          <CameraOff className="h-8 w-8 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {!isStarting && !error && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center">
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white/90 backdrop-blur-xs">
            Inquadra il codice a barre del prodotto
          </span>
        </div>
      )}
    </div>
  );
}