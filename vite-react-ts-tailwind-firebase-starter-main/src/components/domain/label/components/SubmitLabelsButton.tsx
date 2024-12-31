import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Check for successful mutation, then clear state and navigate
    if (!isLoading && updateChunksMutation.isSuccess) {
      clearStateCallback();
      navigate(`/crop?congratsCount=${Object.keys(combinedData).length}`); // Show a good job banner when they finish!
    }
  }, [updateChunksMutation.isSuccess, combinedData, clearStateCallback, navigate]);

  const handleSubmit = () => {
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
  };

  return (
    <>
      <button disabled={isLoading} onClick={editLabelsCallback} className="btn">
        Make More Changes
      </button>
      <button disabled={isLoading} onClick={handleSubmit} className={`btn btn-primary ${isLoading ? 'loading' : ''}`}>
        {isLoading ? 'Loading...' : 'Submit Labels'}
      </button>
    </>
  );
};
