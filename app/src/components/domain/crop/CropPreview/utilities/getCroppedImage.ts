import { PixelCrop } from 'react-image-crop';

export function getCroppedImage(
  image: HTMLImageElement,
  previewCanvas: HTMLCanvasElement,
  completedCrop: PixelCrop,
): string {
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

  // Create a regular canvas for the final result (no scaling)
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set the canvas size to match the completed crop size (no resizing)
  canvas.width = completedCrop.width;
  canvas.height = completedCrop.height;

  // Calculate scale factors for cropping from the original image
  const scaleX = image.naturalWidth > 0 ? image.naturalWidth / image.width : 1;
  const scaleY = image.naturalHeight > 0 ? image.naturalHeight / image.height : 1;

  // Draw the cropped portion directly onto the canvas, without scaling
  ctx.drawImage(
    image,
    completedCrop.x * scaleX, // X position of the crop in the original image
    completedCrop.y * scaleY, // Y position of the crop in the original image
    completedCrop.width * scaleX, // Width of the crop in the original image
    completedCrop.height * scaleY, // Height of the crop in the original image
    0, // X position on the canvas
    0, // Y position on the canvas
    completedCrop.width, // Width on the canvas (no scaling)
    completedCrop.height, // Height on the canvas (no scaling)
  );

  // Create a new image element
  return canvas.toDataURL('image/png'); // Convert the canvas to a base64 data URL
}
