import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpsertDocs } from '~/lib/firestore';
import { CombinedFormData } from './form-utils';

export const SubmitLabelsButton = ({
  combinedData,
  editLabelsCallback,
  clearStateCallback,
}: {
  combinedData: Record<string, CombinedFormData>;
  editLabelsCallback: () => void;
  clearStateCallback: () => void;
}) => {
  const updateChunksMutation = useUpsertDocs('chunks');
  const [isLoadingInternal, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const isLoading = isLoadingInternal || updateChunksMutation.isPending;

  if (updateChunksMutation.isSuccess) {
    clearStateCallback();
    navigate(`/crop?congratsCount=${Object.keys(combinedData).length}`); // Show a good job banner when they finish!
  }

  return (
    <>
      <button disabled={isLoading} onClick={editLabelsCallback} className="btn">
        Make More Changes
      </button>
      <button
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          // Rename "cropId" to "documentId"
          const newData = Object.values(combinedData).map((x: CombinedFormData) => ({
            documentId: x.cropId,
            croppedImageSrc: x.croppedImageSrc,
            parsedInput: x.parsedInput,
            parsedInputConfidence: x.parsedInputConfidence,
            uploadDate: x.uploadDate,
            uploadedBy: x.uploadedBy,
          }));

          updateChunksMutation.mutate(newData);
          setIsLoading(false);
        }}
        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? 'Loading...' : 'Submit Labels'}
      </button>
    </>
  );
};
