import { where } from 'firebase/firestore';
import { useGetDocData, useGetDocsData } from '~/lib/firestore';
import { GetSelectedCropsResult } from '~/types/chunkData';
import { CropData } from '~/types/cropData';
import CropPreview from './CropPreview/CropPreview';

const useCropData = (
  cropId: string,
): { cropData: CropData | undefined; isCropLoading: boolean; isCropError: boolean } => {
  const { data, isLoading, isError } = useGetDocData('jobs', cropId);

  if (!!data) {
    if (data?.imageUrl && data?.cropState <= 2 && data?.cropState >= 0) {
      return { cropData: data as CropData, isCropLoading: isLoading, isCropError: isError };
    } else {
      return { cropData: undefined, isCropLoading: isLoading, isCropError: isError };
    }
  }

  return { cropData: undefined, isCropLoading: isLoading, isCropError: isError };
};

const useSelectedCropsData = (
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

export function CropForId({ labelId }: { labelId: string }) {
  const { cropData, isCropLoading, isCropError } = useCropData(labelId);
  const { selectedCrops, isSelectedCropsLoading, isSelectedCropsError } = useSelectedCropsData(labelId);

  if (isCropLoading || isSelectedCropsLoading) {
    return <p> Loading... </p>;
  }

  if (isCropError || isSelectedCropsError || !cropData || !selectedCrops) {
    return <p className="text-red-500"> Something went wrong. </p>;
  }

  if (cropData.cropState != 0) {
    return <p className="text-yellow-500"> This whiteboard is already done being labelled. </p>;
  }

  return (
    <div className="p-4 flex-col flex justify-center max-w-80">
      <CropPreview imgSrc={cropData.imageUrl} whiteBoardId={labelId} selectedCrops={selectedCrops} />
    </div>
  );
}
