import { MathfieldElement } from 'mathlive';
import { GetSelectedCropsResult } from '~/types/chunkData';
import '//unpkg.com/mathlive';

export const LabelCard = ({
  crop,
  inputValue,
  handleInputs,
  blurredInputValue,
  handleBlurredInputs,
}: {
  crop: GetSelectedCropsResult;
  inputValue: string;
  handleInputs: (value: string) => void;
  blurredInputValue: string;
  handleBlurredInputs: (value: string) => void;
}) => {
  return (
    <div className="card md:card-side bg-base-100 shadow-xl border-2 ">
      <LabelCardBadge value={blurredInputValue} />
      <figure className="border-r-2 p-4 w-1/4 overflow-auto">
        <img className="w-min" src={crop.croppedImageSrc} />
      </figure>
      <div className="card-body w-3/4 flex flex-col gap-4">
        <p>Input the symbols for the image on the left</p>
        <div>
          <math-field
            onInput={(event) => handleInputs((event.target as MathfieldElement).value)}
            onFocus={() => handleBlurredInputs('')}
            onBlur={(event) => handleBlurredInputs((event.target as MathfieldElement).value)}
          >
            {inputValue}
          </math-field>
        </div>
        <p className="break-words break-all max-w-full">Your input will be stored as:</p>
        <code className="p-4 rounded-xl bg-base-200 card-title break-words break-all max-w-full">
          {inputValue || 'Enter expression above.'}
        </code>
      </div>
    </div>
  );
};

const LabelCardBadge = ({ value }: { value: string }) => (
  <div className={`badge absolute top-4 right-4 ${value ? 'badge-primary' : 'badge-warning'}`}>
    {value ? 'Done' : 'Todo'}
  </div>
);
