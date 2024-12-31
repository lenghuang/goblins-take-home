import { RefObject } from 'react';
import { PixelCrop } from 'react-image-crop';
import { getCroppedImage } from '../utilities/getCroppedImage';
import { setCroppedAreaToWhite } from '../utilities/setCroppedAreaToWhite';

interface ConfirmCropButtonProps {
  imgRef: RefObject<HTMLImageElement>;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  completedCrop: PixelCrop;
  setImage: (newImage: HTMLImageElement) => void;
  addChunk: (newImage: HTMLImageElement) => void;
}

export const ConfirmCropButton = ({
  imgRef,
  previewCanvasRef,
  completedCrop,
  setImage,
  addChunk,
}: ConfirmCropButtonProps) => {
  const onClick = async () => {
    if (imgRef.current && previewCanvasRef.current) {
      try {
        // Scale the cropped image based on the original image
        const croppedImage = await getCroppedImage(imgRef.current, previewCanvasRef.current, completedCrop);
        addChunk(croppedImage);

        // You can also handle the offscreen image blob for further processing (e.g., uploading)
        // const blob = await offscreen.convertToBlob({ type: 'image/png' });
        // console.log(blob); // For example, you can upload it or store it as needed

        // Generate the image with the cropped area set to white
        const croppedAreaRemovedImage = setCroppedAreaToWhite(imgRef.current, completedCrop);

        // Update the state with the modified image
        setImage(croppedAreaRemovedImage);
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
