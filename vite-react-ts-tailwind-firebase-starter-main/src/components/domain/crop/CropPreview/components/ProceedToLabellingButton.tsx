import { GetSelectedCropsResult } from '~/types/chunkData';

export const ProceedToLabellingButton = ({
  whiteBoardId,
  croppedImages,
  selectedCrops,
}: {
  whiteBoardId: string;
  croppedImages: Array<HTMLImageElement>;
  selectedCrops?: Array<GetSelectedCropsResult>;
}) => {
  // Here, move to label?id page with all chunks that are not labelled yet
  // Also, need to upload chunks to cloud before doing so
  // Display a nice little loading UI
  const active = croppedImages?.length > 0 || (selectedCrops && selectedCrops.length > 0);

  return (
    <a className="w-full" href={`/label?id=${whiteBoardId}`}>
      <button disabled={!active} className={`btn btn-primary w-full ${active ? '' : 'disabled'}`}>
        Proceed To Labelling
      </button>
    </a>
  );
};
