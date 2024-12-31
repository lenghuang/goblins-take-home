import { useEffect, useRef } from 'react';
import { FiveStarRatingDisplay } from './FiveStarRating';
import { CombinedFormData, getCombinedLabelFormData, LabelFormInputs } from './form-utils';

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
      <div className="modal-box w-11/12 max-w-5xl">
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
          <button onClick={() => setIsModalOpen(false)} className="btn">
            Close
          </button>
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
            <img src={croppedImageSrc} alt={`Image for ${cropId}`} className="w-20 h-20 object-contain rounded" />
          </td>
          <td>
            <code className="rounded-xl bg-base-200 p-2">{parsedInput}</code>
          </td>
          <td>
            <FiveStarRatingDisplay value={parsedInputConfidence} />
          </td>
        </tr>
      );
    })}
  </tbody>
);
