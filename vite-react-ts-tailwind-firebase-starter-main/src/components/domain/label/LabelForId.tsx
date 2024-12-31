import { useEffect, useRef, useState } from 'react';
import { useSelectedCropsData } from '../crop/CropPreview/utilities/useSelectedCropsData';
import { LabelCard } from './LabelCard';
import '//unpkg.com/mathlive';

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

    const inputKeys = Object.keys(inputs);
    if (selectedCrops.length !== inputKeys.length) {
      const difference = selectedCrops.filter((x) => !inputKeys.includes(x.cropId));
      difference.forEach((x) => setErrors((prev) => ({ ...prev, [x.cropId]: 'Missing math input' })));
      return;
    }

    const confidenceKeys = Object.keys(confidences);
    if (selectedCrops.length !== confidenceKeys.length) {
      const difference = selectedCrops.filter((x) => !confidenceKeys.includes(x.cropId));
      difference.forEach((x) => setErrors((prev) => ({ ...prev, [x.cropId]: 'Missing confidence rating' })));
      return;
    }

    const combinedData = Object.fromEntries(
      selectedCrops.map((crop) => [
        crop.cropId,
        { ...crop, parsedInput: inputs[crop.cropId], parsedInputConfidence: confidences[crop.cropId] },
      ]),
    );

    setIsModalOpen(true);

    console.log(combinedData);
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
          <ConfirmLabelModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
      </div>
    </>
  );
}

const ConfirmLabelModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (arg: boolean) => void;
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (!isModalOpen && modalRef.current) {
      modalRef.current.close();
    }
  }, [isModalOpen]);

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Click the button below to close</p>
        <div className="modal-action">
          <button onClick={() => setIsModalOpen(false)} className="btn">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};
