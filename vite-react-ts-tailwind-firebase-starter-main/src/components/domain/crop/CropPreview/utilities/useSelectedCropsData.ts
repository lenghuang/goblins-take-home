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
  const { data, isLoading, isError } = useGetDocsData('chunks', where('whiteBoardId', '==', cropId));

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
