// Taken From https://github.com/sekoyo/react-image-crop

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from './utilities/canvasPreview';
import { useDebounceEffect } from './utilities/useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';
import { loadImageFromSessionStorage, storeImageInSessionStorage, updateImageInSessionStorage } from '~/lib/image';
import { GetSelectedCropsResult } from '~/types/chunkData';
import { ConfirmCropButton } from './components/ConfirmCropButton';
import { CroppedImages } from './components/CroppedImages';
import { LabelStep } from './components/LabelStep';
import { PreviewImageOfCrop } from './components/PreviewImageofCrop';
import { ProceedToLabellingButton } from './components/ProceedToLabellingButton';
import { ResetImageButton } from './components/ResetImageButton';

interface CropPreviewProps {
  imgSrc: string;
  whiteBoardId: string;
  selectedCrops: Array<GetSelectedCropsResult>;
}

export default function CropPreview({ imgSrc, whiteBoardId, selectedCrops }: CropPreviewProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();
  const [croppedImages, setCroppedImages] = useState<Array<HTMLImageElement>>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, 1, 0);
      }
    },
    100,
    [completedCrop],
  );

  useEffect(() => {
    const asyncImageUpdate = async () => {
      const storedImage = loadImageFromSessionStorage(imgSrc);
      if (storedImage) {
        setImage(storedImage);
      } else {
        await storeImageInSessionStorage(imgSrc);
        const storedImage = loadImageFromSessionStorage(imgSrc);
        if (storedImage) setImage(storedImage);
      }
    };

    asyncImageUpdate();
  }, [imgSrc]);

  return (
    <div className="flex flex-col gap-6">
      <LabelStep step={1} text="Select and crop" />
      <ReactCrop
        className="rounded-xl border-2 shadow-xl overflow-hidden"
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
      >
        <img ref={imgRef} alt="Crop me" src={image?.src ?? imgSrc} />
      </ReactCrop>
      <LabelStep step={2} text="Confirm your crop" />
      {completedCrop && completedCrop.height >= 0 && completedCrop.width >= 0 && (
        <>
          <PreviewImageOfCrop completedCrop={completedCrop} ref={previewCanvasRef} />{' '}
          <ConfirmCropButton
            imgRef={imgRef}
            imgSrc={imgSrc}
            previewCanvasRef={previewCanvasRef}
            completedCrop={completedCrop}
            setImage={(callbackImage) => {
              setImage(callbackImage);
              updateImageInSessionStorage(imgSrc, callbackImage);
            }}
            addChunk={(callbackImage) => setCroppedImages((prev) => prev.concat(callbackImage))}
            whiteBoardId={whiteBoardId}
          />
        </>
      )}
      <LabelStep step={3} text="Confirm your selections" />
      <CroppedImages selectedCrops={selectedCrops} croppedImages={croppedImages} />
      <div className="flex gap-2 flex-col">
        <ProceedToLabellingButton croppedImages={croppedImages} />
        <ResetImageButton imgSrc={imgSrc} />
      </div>
    </div>
  );
}
