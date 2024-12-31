import { useState } from 'react';
import { useUserEmail } from '~/components/contexts/UserContext';
import { formatFirestoreTimestampAgo } from '~/lib/dates';
import { useDeleteDoc } from '~/lib/firestore';
import { GetSelectedCropsResult } from '~/types/chunkData';

export const CroppedImages = ({
  croppedImages,
  selectedCrops,
}: {
  croppedImages: Array<HTMLImageElement>;
  selectedCrops: Array<GetSelectedCropsResult>;
}) => {
  const userEmail = useUserEmail();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const deleteChunkMutation = useDeleteDoc('chunks');

  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {selectedCrops?.map((crop, i) => (
        <div key={`Selected_Crops_${i}`} className="card card-compact bg-base-100 h-min w-72 border-2  shadow-xl">
          <figure>
            <img className="p-2" src={crop.croppedImageSrc} />
          </figure>
          <div className="card-body flex-col flex gap-2 border-t-2">
            {userEmail === crop.uploadedBy ? (
              <p>
                Added {formatFirestoreTimestampAgo(crop.uploadDate)}.{' '}
                <button
                  disabled={deleteLoading}
                  onClick={async () => {
                    setDeleteLoading(true);
                    await deleteChunkMutation.mutate(crop.cropId);
                    location.reload();
                  }}
                  className="underline hover:text-warning"
                >
                  {deleteLoading ? 'Loading...' : 'Delete?'}
                </button>
              </p>
            ) : (
              <p>
                Added {formatFirestoreTimestampAgo(crop.uploadDate)} by {crop.uploadedBy}
              </p>
            )}
          </div>
        </div>
      ))}
      {croppedImages?.map((image, i) => (
        <div key={`Cropped_Images_${i}`} className="card card-compact bg-base-100 h-min w-72 border-2  shadow-xl">
          <figure>
            <img className="p-2" src={image.src} />
          </figure>
          <div className="card-body flex-col flex gap-2 border-t-2">
            <p>Added just now</p>
          </div>
        </div>
      ))}
    </div>
  );
};
