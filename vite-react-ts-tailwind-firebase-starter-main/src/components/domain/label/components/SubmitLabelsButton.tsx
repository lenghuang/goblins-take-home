import { useEffect, useMemo, useState } from 'react';
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
  const combinedDataCount = useMemo(() => Object.keys(combinedData).length, [combinedData]);

  useEffect(() => {
    if (!isLoading && updateChunksMutation.isSuccess) {
      clearStateCallback();
      navigate(`/crop?congratsCount=${combinedDataCount}`);
    }
  }, [updateChunksMutation.isSuccess, combinedDataCount]);

  const handleSubmit = () => {
    setIsLoading(true);

    const newData = Object.values(combinedData).map((x: CombinedFormData) => ({
      documentId: x.cropId,
      croppedImageSrc: x.croppedImageSrc,
      parsedInput: x.parsedInput,
      parsedInputConfidence: x.parsedInputConfidence,
      uploadDate: x.uploadDate,
      uploadedBy: x.uploadedBy,
    }));

    updateChunksMutation.mutate(newData, {
      onSettled: () => {
        setIsLoading(false);
      },
    });
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
