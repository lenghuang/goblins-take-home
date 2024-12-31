import { forwardRef } from 'react';
import { PixelCrop } from 'react-image-crop';

interface PreviewImageOfCropProps {
  completedCrop: PixelCrop;
}

export const PreviewImageOfCrop = forwardRef<HTMLCanvasElement, PreviewImageOfCropProps>(({ completedCrop }, ref) => {
  return (
    <>
      {!!completedCrop && (
        <div className="rounded-xl border-2 shadow-xl overflow-hidden w-full flex justify-center">
          <canvas
            ref={ref}
            className="border-4 border-dotted "
            style={{
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        </div>
      )}
    </>
  );
});
