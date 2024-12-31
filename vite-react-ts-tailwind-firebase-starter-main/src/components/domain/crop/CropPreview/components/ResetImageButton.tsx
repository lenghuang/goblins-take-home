import { deleteImageFromSessionStorage } from '~/lib/image';

export const ResetImageButton = ({ imgSrc }: { imgSrc: string }) => {
  return (
    <button
      className="w-full btn btn-outline"
      onClick={() => {
        deleteImageFromSessionStorage(imgSrc);
        location.reload();
      }}
    >
      Reset Image
    </button>
  );
};
