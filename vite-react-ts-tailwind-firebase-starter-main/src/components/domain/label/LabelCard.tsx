import { MathfieldElement } from 'mathlive';
import { GetSelectedCropsResult } from '~/types/chunkData';
import '//unpkg.com/mathlive';

export const LabelCard = ({
  index,
  crop,
  inputValue,
  handleInputs,
  blurredInputValue,
  handleBlurredInputs,
  onConfidenceChange,
}: {
  index: number;
  crop: GetSelectedCropsResult;
  inputValue: string;
  handleInputs: (value: string) => void;
  blurredInputValue: string;
  handleBlurredInputs: (value: string) => void;
  onConfidenceChange: (value: number) => void;
}) => {
  return (
    <div className="card md:card-side bg-base-100 shadow-xl border-2 ">
      <LabelCardBadge value={blurredInputValue} />
      <figure className="border-r-2 p-4 w-1/4 overflow-auto">
        <img className="w-min" src={crop.croppedImageSrc} />
      </figure>
      <div className="card-body w-3/4 flex flex-col gap-4">
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
        <code className="p-4 rounded-xl bg-base-200 card-title break-words break-all max-w-full">
          {inputValue || 'Enter expression above.'}
        </code>
        <LabelCardStep step={`${index}.2`} text="Give a confidence rating" />
        <ConfidenceRating index={index} onConfidenceChange={onConfidenceChange} />
      </div>
    </div>
  );
};

const LabelCardBadge = ({ value }: { value: string }) => (
  <div className={`badge absolute top-4 right-4 ${value ? 'badge-primary' : 'badge-warning'}`}>
    {value ? 'Done' : 'Todo'}
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
}: {
  index: number;
  onConfidenceChange: (rating: number) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rating = Number(event.target.value);
    onConfidenceChange(rating); // Call the handler with the selected rating
  };

  return (
    <div className="rating rating-lg">
      <div className="flex flex-row gap-6 items-center">
        <div className="flex flex-col gap-1 items-center justify-center bg-base-200 rounded-xl p-2">
          <div>😔😔😔</div>
          <div>Least Confident</div>
        </div>
        <div>
          <input
            key={`${index}_confidence_star_0`}
            type="radio"
            name={`${index}_label-confidence-rating`}
            className="rating-hidden hidden"
            onChange={handleChange}
            defaultChecked={true}
          />
          {Array.from({ length: 5 }, (_, i) => {
            const value = i + 1;
            return (
              <input
                key={`${index}_confidence_star_${value}`}
                type="radio"
                name={`${index}_label-confidence-rating`}
                value={value}
                className="mask mask-star-2"
                onChange={handleChange}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-1 items-center justify-center bg-base-200 rounded-xl p-2">
          <div>😄😄😄</div>
          <div>Most Confident</div>
        </div>
      </div>
    </div>
  );
};
