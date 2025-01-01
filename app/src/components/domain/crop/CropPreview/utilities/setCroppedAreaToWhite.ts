import { PixelCrop } from 'react-image-crop';

export const setCroppedAreaToWhite = (image: HTMLImageElement, crop: PixelCrop): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate the scale factor based on the displayed image size vs. the natural image size
  const scaleX = image.naturalWidth > 0 ? image.naturalWidth / image.width : 1;
  const scaleY = image.naturalHeight > 0 ? image.naturalHeight / image.height : 1;

  // Set the canvas size to match the original image size
  canvas.width = image.naturalWidth > 0 ? image.naturalWidth : image.width;
  canvas.height = image.naturalHeight > 0 ? image.naturalHeight : image.height;

  // Draw the original image onto the canvas
  ctx.drawImage(image, 0, 0);

  // Get the adjusted crop area based on scaling
  const scaledCropX = crop.x * scaleX;
  const scaledCropY = crop.y * scaleY;
  const scaledCropWidth = crop.width * scaleX;
  const scaledCropHeight = crop.height * scaleY;

  // Get image data from the scaled crop area
  const imageData = ctx.getImageData(scaledCropX, scaledCropY, scaledCropWidth, scaledCropHeight);

  // Change the cropped area to white
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255; // Red
    imageData.data[i + 1] = 255; // Green
    imageData.data[i + 2] = 255; // Blue
    imageData.data[i + 3] = 255; // Alpha (fully opaque)
  }

  // Place the modified image data back to the canvas
  ctx.putImageData(imageData, scaledCropX, scaledCropY);

  // Create a new image element from the canvas data
  return canvas.toDataURL('image/png');
};
