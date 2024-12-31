// Taken From https://github.com/sekoyo/react-image-crop

import { PixelCrop } from 'react-image-crop';

export async function convertImageToBlob(
  image: HTMLImageElement,
  previewCanvas: HTMLCanvasElement,
  completedCrop: PixelCrop,
): Promise<Blob> {
  if (!image || !previewCanvas || !completedCrop) {
    throw new Error('Crop canvas does not exist');
  }

  // Ensure the crop width and height are valid and non-zero
  if (completedCrop.width <= 0 || completedCrop.height <= 0) {
    throw new Error('Invalid crop dimensions');
  }

  // Check if the image source requires CORS
  if (image.crossOrigin === null) {
    image.crossOrigin = 'anonymous'; // Set CORS if it's not set
  }

  // This will size relative to the uploaded image
  // size. If you want to size according to what they
  // are looking at on screen, remove scaleX + scaleY
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  console.log(scaleX, scaleY);

  console.log(image.naturalHeight, image.height);

  console.log(completedCrop);

  const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
  const ctx = offscreen.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  console.log(offscreen);

  ctx.drawImage(
    previewCanvas,
    0,
    0,
    previewCanvas.width,
    previewCanvas.height,
    0,
    0,
    offscreen.width,
    offscreen.height,
  );
  // You might want { type: "image/jpeg", quality: <0 to 1> } to
  // reduce image size
  const blob = await offscreen.convertToBlob({
    type: 'image/png',
  });

  console.log(blob);
  return blob;
}
