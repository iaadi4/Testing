export const BANNER_WIDTH = 1500;
export const BANNER_HEIGHT = 500;
export const MAX_BANNER_OUTPUT_BYTES = 300 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read the image"));
    img.src = src;
  });
}

export async function compressBannerFile(file: File): Promise<{ dataUrl: string; previewUrl: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a valid image file (PNG, JPG, WebP).");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image file is too large. Maximum upload is 8MB before compression.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_WIDTH;
    canvas.height = BANNER_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process the image");

    const scale = Math.max(BANNER_WIDTH / img.width, BANNER_HEIGHT / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.fillStyle = "#f4f4f5";
    ctx.fillRect(0, 0, BANNER_WIDTH, BANNER_HEIGHT);
    ctx.drawImage(img, (BANNER_WIDTH - dw) / 2, (BANNER_HEIGHT - dh) / 2, dw, dh);

    const tryType = canvas.toDataURL("image/webp", 0.82).startsWith("data:image/webp")
      ? "image/webp"
      : "image/jpeg";

    let quality = 0.86;
    let dataUrl = canvas.toDataURL(tryType, quality);
    while (dataUrl.length > MAX_BANNER_OUTPUT_BYTES * 1.37 && quality > 0.5) {
      quality -= 0.08;
      dataUrl = canvas.toDataURL(tryType, quality);
    }

    return { dataUrl, previewUrl: objectUrl };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}
