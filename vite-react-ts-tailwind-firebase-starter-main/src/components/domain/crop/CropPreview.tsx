// Taken From https://github.com/sekoyo/react-image-crop

import { useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from './utilities/canvasPreview';
import { useDebounceEffect } from './utilities/useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';
import { AdditionalControls } from './components/AdditionalControls';

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
    <div className="flex flex-col gap-4">
      <ReactCrop
        className="m-8 border-2 shadow-xl overflow-hidden"
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
      >
        <img ref={imgRef} alt="Crop me" src={imgSrc} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }} />
      </ReactCrop>

      <p className="text-md font-semibold"> Make a selection to see the preview here </p>
      {!!completedCrop && (
        <>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
        </>
      )}

      <AdditionalControls
        disabled={!imgSrc}
        scaleValue={scale}
        onScaleChange={(e) => setScale(Number(e.target.value))}
        rotateValue={rotate}
        onRotateChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
      />
    </div>
  );
}
