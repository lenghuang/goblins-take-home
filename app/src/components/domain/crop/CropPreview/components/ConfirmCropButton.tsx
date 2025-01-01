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
  completedCrop?: PixelCrop;
  setImage: (newImage: HTMLImageElement) => void;
  addChunk: (newImage: HTMLImageElement) => void;
  whiteBoardId: string;
}

export const ConfirmCropButton = ({
  imgRef,
  imgSrc,
  completedCrop,
  setImage,
  addChunk,
  whiteBoardId,
}: ConfirmCropButtonProps) => {
  const uploadImageChunkMutation = useUpsertDoc('chunks', false);
  const userEmail = useUserEmail();

  const onClick = async (completedCropArg: PixelCrop) => {
    if (imgRef.current) {
      const image = await loadImage(imgRef.current.src, imgRef.current.width, imgRef.current.height);
      try {
        const addCroppedImageToCollection = async () => {
          const croppedImage = await loadImage(getCroppedImage(image, completedCropArg));
          addChunk(croppedImage);

          // Get chunk data
          await uploadImageChunkMutation.mutate({
            uploadedBy: userEmail,
            uploadDate: new Date(),
            croppedImageSrc: croppedImage.src,
            whiteBoardId: whiteBoardId,
            whiteBoardImageUrl: imgSrc,
            parsedInput: '', // Default values
            parsedInputConfidence: -1, // // Default values
          });
        };

        const whiteOutCroppedAreaInOriginalImage = async () => {
          const croppedAreaRemovedImage = await loadImage(setCroppedAreaToWhite(image, completedCropArg));
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
    <button
      disabled={!completedCrop || completedCrop.height <= 0 || completedCrop.width <= 0}
      onClick={() => completedCrop && onClick(completedCrop)}
      className="btn w-full"
    >
      Add Crop To Collection
    </button>
  );
};
