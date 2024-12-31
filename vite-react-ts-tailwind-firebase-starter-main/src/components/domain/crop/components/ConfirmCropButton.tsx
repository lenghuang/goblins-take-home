import { RefObject } from 'react';
import { PixelCrop } from 'react-image-crop';
import { convertImageToBlob } from '../utilities/convertImageToBlob';

interface ConfirmCropButtonProps {
  imgRef: RefObject<HTMLImageElement>;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  completedCrop: PixelCrop;
}

export const ConfirmCropButton = ({ imgRef, previewCanvasRef, completedCrop }: ConfirmCropButtonProps) => {
  // OnClick:
  // Load image into storage
  // Get that URL and persist it to the chunk DB
  // Add that to a useState
  // Also mark that part of image as white

  const onClick = async () => {
    if (imgRef.current && previewCanvasRef.current) {
      try {
        const blob = await convertImageToBlob(imgRef.current, previewCanvasRef.current, completedCrop);
        console.log(blob);
        // Handle the blob as needed, e.g., store it or update state
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <button onClick={onClick} className="btn w-full">
      Confirm
    </button>
  );
};
