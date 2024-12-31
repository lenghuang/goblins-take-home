import { CroppedImages } from '../crop/CropPreview/components/CroppedImages';
import { LabelStep } from '../crop/CropPreview/components/LabelStep';
import { useSelectedCropsData } from '../crop/CropPreview/utilities/useSelectedCropsData';

export function LabelForId({ labelId }: { labelId: string }) {
  const { selectedCrops, isSelectedCropsLoading, isSelectedCropsError } = useSelectedCropsData(labelId);

  if (isSelectedCropsLoading) {
    return <p> Loading... </p>;
  }

  if (isSelectedCropsError || !selectedCrops) {
    return <p className="text-red-500"> Something went wrong. </p>;
  }

  return (
    <div className="p-4 flex-col flex justify-center max-w-80">
      <div className="flex flex-col gap-6">
        <LabelStep step={1} text={'View Images'} caption={'View Images'} />
        <CroppedImages selectedCrops={selectedCrops} />
      </div>
    </div>
  );
}
