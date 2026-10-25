/**
 * Ridimensiona e converte un file immagine in WebP (max 1000x1000px)
 * @param {File} file
 * @param {number} maxSize - default 1000
 * @param {number} quality - default 0.82
 * @returns {Promise<File>}
 */
export async function compressImageToWebP(file, maxSize = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Ridimensiona proporzionalmente entro maxSize x maxSize (senza deformare il prodotto)
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Errore durante la conversione in WebP"));
          }
          const webpFile = new File([blob], "product.webp", {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Impossibile leggere il file immagine selezionato"));
    };

    img.src = objectUrl;
  });
}