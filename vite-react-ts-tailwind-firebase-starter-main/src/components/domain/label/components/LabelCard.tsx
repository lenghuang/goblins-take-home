import { MathfieldElement } from 'mathlive';
import { GetSelectedCropsResult } from '~/types/chunkData';
import { FiveStarRatingInput } from './FiveStarRating';
import '//unpkg.com/mathlive';

export const LabelCard = ({
  index,
  crop,
  inputValue,
  handleInputs,
  blurredInputValue,
  handleBlurredInputs,
  confidenceValue,
  onConfidenceChange,
  error,
}: {
  index: number;
  crop: GetSelectedCropsResult;
  inputValue: string;
  handleInputs: (value: string) => void;
  blurredInputValue: string;
  handleBlurredInputs: (value: string) => void;
  confidenceValue?: number;
  onConfidenceChange: (value: number) => void;
  error: string | undefined;
}) => {
  return (
    <div className="card md:card-side bg-base-100 shadow-xl border-2 ">
      <LabelCardBadge error={error} value={blurredInputValue} />
      <figure className="border-r-2 p-4 w-1/4 overflow-hidden flex items-center justify-center">
        <img className="max-w-full max-h-full object-contain" src={crop.croppedImageSrc} />
      </figure>
      <div className="card-body w-3/4 flex flex-col gap-6">
        <LabelCardStep step={`${index}.1`} text="Input the symbols for the image on the left" />
        <div>
          <math-field
            onInput={(event) => handleInputs((event.target as MathfieldElement).value)}
            onFocus={() => handleBlurredInputs('')}
            onBlur={(event) => handleBlurredInputs((event.target as MathfieldElement).value)}
          >
            {inputValue}
          </math-field>
        </div>
        <LabelCardStep step={`${index}.2`} text="Confirm the below input" />
        <code className="p-4 rounded-xl bg-base-200  break-words break-all max-w-full">
          {inputValue || 'Enter expression above.'}
        </code>
        <LabelCardStep step={`${index}.3`} text="Give a confidence rating" />
        <ConfidenceRating index={index} onConfidenceChange={onConfidenceChange} defaultValue={confidenceValue} />
        {error && <p className="text-error">{error}</p>}
      </div>
    </div>
  );
};

const LabelCardBadge = ({ value, error }: { value: string; error: string | undefined }) => (
  <div className={`badge absolute top-4 right-4 ${error ? 'badge-error' : value ? 'badge-primary' : 'badge-warning'}`}>
    {error ? 'Error' : value ? 'Done' : 'Todo'}
  </div>
);

const LabelCardStep = ({ step, text }: { step: string; text: string }) => (
  <div className="flex flex-row gap-2 font-semibold">
    <div className="flex items-center justify-center text-center rounded-full w-9 h-6 bg-primary ">{step}</div>
    <p>{text}</p>
  </div>
);

const ConfidenceRating = ({
  index,
  onConfidenceChange,
  defaultValue,
}: {
  index: number;
  onConfidenceChange: (rating: number) => void;
  defaultValue?: number;
}) => {
  return (
    <div className="rating rating-lg">
      <div className="flex flex-row gap-6 items-center">
        <div className="flex flex-col gap-1 bg-base-200 rounded-xl p-2 w-min text-center text-sm">Not Confident</div>
        <FiveStarRatingInput
          index={index}
          defaultValue={defaultValue}
          name="confidence-rating-label-input"
          handleChange={(e) => onConfidenceChange(Number(e.target.value))}
        />
        <div className="flex flex-col gap-1 bg-base-200 rounded-xl p-2 w-min text-center text-sm">Very Confident</div>
      </div>
    </div>
  );
};
