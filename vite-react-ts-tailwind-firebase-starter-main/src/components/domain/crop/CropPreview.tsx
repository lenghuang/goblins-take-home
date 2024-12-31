// Taken From https://github.com/sekoyo/react-image-crop

import { useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from './utilities/canvasPreview';
import { useDebounceEffect } from './utilities/useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';
import { AdditionalControls } from './components/AdditionalControls';
import { ConfirmCropButton } from './components/ConfirmCropButton';
import { LabelStep } from './components/LabelStep';
import { PreviewImageOfCrop } from './components/PreviewImageofCrop';

interface CropPreviewProps {
  imgSrc: string;
}

export default function CropPreview({ imgSrc }: CropPreviewProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
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

  return (
    <div className="flex flex-col gap-6">
      <LabelStep step={1} text="Drag and drop to select a section to label" />
      <ReactCrop
        className="border-2 shadow-xl overflow-hidden"
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
      >
        <img ref={imgRef} alt="Crop me" src={imgSrc} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }} />
      </ReactCrop>
      <AdditionalControls
        disabled={!imgSrc}
        scaleValue={scale}
        onScaleChange={(e) => setScale(Number(e.target.value))}
        rotateValue={rotate}
        onRotateChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
      />
      <LabelStep step={2} text="Confirm your crop" />
      {!!completedCrop && (
        <>
          <PreviewImageOfCrop completedCrop={completedCrop} ref={previewCanvasRef} />{' '}
          <ConfirmCropButton imgRef={imgRef} previewCanvasRef={previewCanvasRef} completedCrop={completedCrop} />
        </>
      )}

      <LabelStep step={2} text="Confirm your selections" />
    </div>
  );
}
