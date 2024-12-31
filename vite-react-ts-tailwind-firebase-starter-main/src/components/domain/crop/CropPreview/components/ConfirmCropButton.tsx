import { RefObject } from 'react';
import { PixelCrop } from 'react-image-crop';
import { useUserEmail } from '~/components/contexts/UserContext';
import { useUpsertDoc } from '~/lib/firestore';
import { loadImage } from '~/lib/image';
import { getCroppedImage } from '../utilities/getCroppedImage';
import { setCroppedAreaToWhite } from '../utilities/setCroppedAreaToWhite';

interface ConfirmCropButtonProps {
  imgRef: RefObject<HTMLImageElement>;
  imgSrc: string; // original image
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  completedCrop: PixelCrop;
  setImage: (newImage: HTMLImageElement) => void;
  addChunk: (newImage: HTMLImageElement) => void;
  whiteBoardId: string;
}

export const ConfirmCropButton = ({
  imgRef,
  imgSrc,
  previewCanvasRef,
  completedCrop,
  setImage,
  addChunk,
  whiteBoardId,
}: ConfirmCropButtonProps) => {
  const uploadImageChunkMutation = useUpsertDoc('chunks', null);
  const userEmail = useUserEmail();

  const onClick = async () => {
    if (imgRef.current) {
      const image = await loadImage(imgRef.current.src, imgRef.current.width, imgRef.current.height);
      try {
        const addCroppedImageToCollection = async () => {
          if (previewCanvasRef.current) {
            const croppedImage = await loadImage(getCroppedImage(image, previewCanvasRef.current, completedCrop));
            addChunk(croppedImage);
            console.log('added croppedImage');

            // Get chunk data
            await uploadImageChunkMutation.mutate({
              uploadedBy: userEmail,
              uploadDate: new Date(),
              croppedImageSrc: croppedImage.src,
              whiteBoardId: whiteBoardId,
              whiteBoardImageUrl: imgSrc,
            });
          }
        };

        const whiteOutCroppedAreaInOriginalImage = async () => {
          const croppedAreaRemovedImage = await loadImage(setCroppedAreaToWhite(image, completedCrop));
          setImage(croppedAreaRemovedImage);
        };

        addCroppedImageToCollection();
        whiteOutCroppedAreaInOriginalImage();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <button onClick={onClick} className="btn w-full">
      Add Crop To Collection
    </button>
  );
};
