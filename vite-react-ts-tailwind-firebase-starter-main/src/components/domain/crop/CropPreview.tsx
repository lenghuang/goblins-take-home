// Taken From https://github.com/sekoyo/react-image-crop

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from './utilities/canvasPreview';
import { useDebounceEffect } from './utilities/useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';
import { loadImageFromSessionStorage, storeImageInSessionStorage } from '~/lib/image';
import { AdditionalControls } from './components/AdditionalControls';
import { ConfirmCropButton } from './components/ConfirmCropButton';
import { LabelStep } from './components/LabelStep';
import { PreviewImageOfCrop } from './components/PreviewImageofCrop';

interface CropPreviewProps {
  imgSrc: string;
}

export default function CropPreview({ imgSrc }: CropPreviewProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();
  const [croppedImages, setCroppedImages] = useState<Array<HTMLImageElement>>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  useEffect(() => {
    const asyncImageUpdate = async () => {
      await storeImageInSessionStorage(imgSrc);
      const storedImage = loadImageFromSessionStorage(imgSrc);
      if (storedImage) setImage(storedImage);
    };

    asyncImageUpdate();
  }, [imgSrc]);

  return (
    <div className="flex flex-col gap-6">
      <LabelStep step={1} text="Drag and drop to select a section to label" />
      <ReactCrop
        className="border-2 shadow-xl overflow-hidden"
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
      >
        <img
          ref={imgRef}
          alt="Crop me"
          src={image?.src ?? imgSrc}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
        />
      </ReactCrop>
      <AdditionalControls
        scaleValue={scale}
        onScaleChange={(e) => setScale(Number(e.target.value))}
        rotateValue={rotate}
        onRotateChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
      />
      <LabelStep step={2} text="Confirm your crop" />
      {!!completedCrop && (
        <>
          <PreviewImageOfCrop completedCrop={completedCrop} ref={previewCanvasRef} />{' '}
          <ConfirmCropButton
            imgRef={imgRef}
            previewCanvasRef={previewCanvasRef}
            completedCrop={completedCrop}
            setImage={setImage}
            addChunk={(image) => setCroppedImages((prev) => prev.concat(image))}
          />
        </>
      )}
      <LabelStep step={2} text="Confirm your selections" />
      {!!croppedImages &&
        croppedImages?.map((image, i) => (
          <div key={`Cropped_Images_${i}`} className="border-2 shadow-xl overflow-hidden w-full flex justify-center">
            <img className="border-4 border-dotted object-contain w-min" src={image.src} />
          </div>
        ))}
    </div>
  );
}
