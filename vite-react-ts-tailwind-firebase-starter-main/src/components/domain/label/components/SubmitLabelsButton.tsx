import { useState } from 'react';
import { useUpsertDocs } from '~/lib/firestore';
import { CombinedFormData } from './form-utils';

export const SubmitLabelsButton = ({
  combinedData,
  editLabelsCallback,
}: {
  combinedData: Record<string, CombinedFormData>;
  editLabelsCallback: () => void;
}) => {
  const updateChunksMutation = useUpsertDocs('chunks');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <button disabled={isLoading} onClick={editLabelsCallback} className={`btn ${isLoading ? 'loading' : ''}`}>
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
