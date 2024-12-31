import { where } from 'firebase/firestore';
import { useGetDocsData } from '~/lib/firestore';
import { GetSelectedCropsResult } from '~/types/chunkData';

export const useSelectedCropsData = (
  cropId: string,
): {
  selectedCrops: Array<GetSelectedCropsResult> | undefined;
  isSelectedCropsLoading: boolean;
  isSelectedCropsError: boolean;
} => {
  // Only return chunks that are not yet labelled
  const { data, isLoading, isError } = useGetDocsData(
    'chunks',
    where('whiteBoardId', '==', cropId),
    where('parsedInput', '==', ''),
    where('parsedInputConfidence', '==', -1), // TODO: bad magic number / default, should be an enum somewhere
  );

  if (data?.length > 0) {
    return {
      selectedCrops: data
        .map(
          (item: any) =>
            item.croppedImageSrc &&
            item.uploadedBy &&
            item.uploadDate &&
            item.documentId &&
            ({
              cropId: item.documentId,
              croppedImageSrc: item.croppedImageSrc,
              uploadedBy: item.uploadedBy,
              uploadDate: item.uploadDate,
            } as GetSelectedCropsResult),
        )
        .filter(Boolean),
      isSelectedCropsLoading: isLoading,
      isSelectedCropsError: isError,
    };
  }

  return { selectedCrops: undefined, isSelectedCropsLoading: isLoading, isSelectedCropsError: isError };
};
