import { useState } from 'react';
import { useSelectedCropsData } from '../crop/CropPreview/utilities/useSelectedCropsData';
import { ConfirmLabelModal } from './components/ConfirmLabelModal';
import { setErrorsGivenInputAndConfidence } from './components/form-utils';
import { LabelCard } from './components/LabelCard';

export function LabelForId({ labelId }: { labelId: string }) {
  const { selectedCrops, isSelectedCropsLoading, isSelectedCropsError } = useSelectedCropsData(labelId);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [blurredInputs, setBlurredInputs] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (isSelectedCropsLoading) {
    return <p> Loading... </p>;
  }

  if (isSelectedCropsError || !selectedCrops) {
    return <p className="text-red-500"> Something went wrong. </p>;
  }

  const onClick = () => {
    setErrors({});
    setErrorsGivenInputAndConfidence({ selectedCrops, inputs, confidences }, setErrors);
    setIsModalOpen(true);
  };

  return (
    <>
      <p className="mb-4">
        Do your best to label everything accurately. If you struggle, please indicate how confident or not you were in
        your answer, on a scale of 1-10.
      </p>
      <div className="p-4 flex-col flex justify-center max-w-80">
        <div className="flex flex-col gap-6">
          {selectedCrops?.map((crop, i) => (
            <div key={`Label_Crop_${i}_${crop.cropId}`}>
              <LabelCard
                index={i + 1}
                crop={crop}
                inputValue={inputs[crop.cropId]}
                handleInputs={(value: string) => setInputs((prev) => ({ ...prev, [crop.cropId]: value }))}
                blurredInputValue={blurredInputs[crop.cropId]}
                handleBlurredInputs={(value: string) => setBlurredInputs((prev) => ({ ...prev, [crop.cropId]: value }))}
                onConfidenceChange={(value: number) => setConfidences((prev) => ({ ...prev, [crop.cropId]: value }))}
                error={errors[crop.cropId]}
              />
            </div>
          ))}
          <button onClick={onClick} className="btn btn-primary w-full">
            Submit Your Labels
          </button>
          <ConfirmLabelModal
            labelFormInputs={{ selectedCrops, inputs, confidences }}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>
    </>
  );
}
