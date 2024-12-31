import { useEffect, useRef } from 'react';
import { FiveStarRatingDisplay } from './FiveStarRating';
import { CombinedFormData, getCombinedLabelFormData, LabelFormInputs } from './form-utils';
import { SubmitLabelsButton } from './SubmitLabelsButton';

export const ConfirmLabelModal = ({
  labelFormInputs,
  isModalOpen,
  setIsModalOpen,
}: {
  labelFormInputs: LabelFormInputs;
  isModalOpen: boolean;
  setIsModalOpen: (arg: boolean) => void;
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const combinedData = getCombinedLabelFormData(labelFormInputs);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (!isModalOpen && modalRef.current) {
      modalRef.current.close();
    }
  }, [isModalOpen]);

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-200 w-screen">
        <h3 className="font-bold text-lg">Confirm Your Label Data</h3>
        <div className="overflow-x-auto">
          <table className="table ">
            {/* Table Header */}
            <thead>
              <tr>
                <th></th>
                <th>Image</th>
                <th>Math Input</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <TableBody combinedData={combinedData} />
          </table>
        </div>
        <div className="modal-action">
          <SubmitLabelsButton editLabelsCallback={() => setIsModalOpen(false)} combinedData={combinedData} />
        </div>
      </div>
    </dialog>
  );
};

const TableBody = ({ combinedData }: { combinedData: Record<string, CombinedFormData> }) => (
  <tbody>
    {Object.keys(combinedData).map((cropId, index) => {
      const { parsedInput, parsedInputConfidence, croppedImageSrc } = combinedData[cropId];
      return (
        <tr key={cropId}>
          <th>{index + 1}</th>
          <td>
            <figure className="flex justify-center p-1 min-w-40 overflow-auto">
              <img src={croppedImageSrc} alt={`Image for ${cropId}`} className="h-min object-contain rounded" />
            </figure>
          </td>
          <td>
            <div className="rounded-xl bg-base-200 p-2 min-w-40 break-all">
              <code>{parsedInput}</code>
            </div>
          </td>
          <td>
            <FiveStarRatingDisplay value={parsedInputConfidence} />
          </td>
        </tr>
      );
    })}
  </tbody>
);
