// Decided to no longer use this component for now because the graphics code of
// figuring out rotation and scaling was a bit of a headache at the time of
// implementing and not the most important thing (for now)

import { ChangeEventHandler } from 'react';

interface AdditionalControlsProps {
  scaleValue: number;
  onScaleChange: ChangeEventHandler<any>;
  rotateValue: number;
  onRotateChange: ChangeEventHandler<any>;
}

export function AdditionalControls({
  scaleValue,
  onScaleChange,
  rotateValue,
  onRotateChange,
}: AdditionalControlsProps) {
  return (
    <div className="flex gap-4 flex-row flex-wrap">
      <div className="flex justify-between w-72 items-center">
        <label className="text-md font-semibold" htmlFor="scale-input">
          Scale:{' '}
        </label>
        <input
          className="input input-bordered"
          id="scale-input"
          type="number"
          step="0.1"
          value={scaleValue}
          onChange={onScaleChange}
        />
      </div>
      <div className="flex justify-between w-72 items-center">
        <label className="text-md font-semibold" htmlFor="rotate-input">
          Rotate:{' '}
        </label>
        <input
          className="input input-bordered"
          id="rotate-input"
          type="number"
          value={rotateValue}
          onChange={onRotateChange}
        />
      </div>
    </div>
  );
}
