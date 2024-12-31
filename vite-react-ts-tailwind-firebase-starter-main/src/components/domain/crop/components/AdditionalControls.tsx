import { ChangeEventHandler } from 'react';

interface AdditionalControlsProps {
  scaleValue: number;
  onScaleChange: ChangeEventHandler<any>;
  rotateValue: number;
  onRotateChange: ChangeEventHandler<any>;
  disabled: boolean;
}

export function AdditionalControls({
  scaleValue,
  onScaleChange,
  rotateValue,
  onRotateChange,
  disabled,
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
          disabled={disabled}
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
          disabled={disabled}
          onChange={onRotateChange}
        />
      </div>
    </div>
  );
}
