import { useState } from 'react';
import { useDeleteDoc } from '~/lib/firestore';
import { usePersistentState } from '~/lib/sessionstorage';
import { useSelectedCropsData } from '../crop/CropPreview/utilities/useSelectedCropsData';
import { ConfirmLabelModal } from './components/ConfirmLabelModal';
import { setErrorsGivenInputAndConfidence } from './components/form-utils';
import { LabelCard } from './components/LabelCard';

export function LabelForId({ labelId }: { labelId: string }) {
  const { selectedCrops, isSelectedCropsLoading, isSelectedCropsError } = useSelectedCropsData(labelId);
  const [inputs, setInputs] = usePersistentState<Record<string, string>>(`LabelForId-InputDictionary-${labelId}`, {});
  const [blurredInputs, setBlurredInputs] = usePersistentState<Record<string, string>>(
    `LabelForId-BlurredInputs-${labelId}`,
    {},
  );
  const [confidences, setConfidences] = usePersistentState<Record<string, number>>(
    `LabelForId-Confidence-${labelId}`,
    {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const deleteJobMutation = useDeleteDoc('jobs');

  if (isSelectedCropsLoading) {
    return <p> Loading... </p>;
  }

  if (isSelectedCropsError) {
    return <p className="text-red-500"> Something went wrong. </p>;
  }

  if (!selectedCrops) {
    return (
      <div className="flex gap-4 flex-col">
        <p> No cropped images to label yet. </p>
        <a href={`/crop?id=${labelId}`}>
          <button className="btn">Create Cropped Images</button>
        </a>
      </div>
    );
  }

  const onClick = () => {
    setErrors({});
    const noErrors = setErrorsGivenInputAndConfidence({ selectedCrops, inputs, confidences }, setErrors);
    if (noErrors) {
      setIsModalOpen(true);
    }
  };

  const clearState = () => {
    setInputs({});
    setBlurredInputs({});
    setConfidences({});
  };

  const clearStateWithDelete = () => {
    clearState();
    // Here, for the sake of keeping my database usage low, we delete once we submit our labels.
    // In the real world, this would be easily abused (make one small crop then submit), and
    // can also be a compliance risk, if we need tracking on who did what.
    deleteJobMutation.mutate(labelId);
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
                confidenceValue={confidences[crop.cropId]}
                onConfidenceChange={(value: number) => setConfidences((prev) => ({ ...prev, [crop.cropId]: value }))}
                error={errors[crop.cropId]}
              />
            </div>
          ))}
          <div className="flex flex-col gap-4 justify-center text-center items-center">
            <button onClick={onClick} className="btn btn-primary text-white w-full">
              Submit Your Labels
            </button>
            <div>or</div>
            <button onClick={clearState} className="btn w-full">
              Clear The Form
            </button>
          </div>
          <ConfirmLabelModal
            labelFormInputs={{ selectedCrops, inputs, confidences }}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            clearState={clearStateWithDelete}
          />
        </div>
      </div>
    </>
  );
}
