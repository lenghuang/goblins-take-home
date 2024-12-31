export const CroppedImages = ({ croppedImages }: { croppedImages: Array<HTMLImageElement> }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {croppedImages?.map((image, i) => (
        <div key={`Cropped_Images_${i}`} className="card card-compact bg-base-100 h-min w-84 border-2  shadow-xl">
          <figure>
            <img className="p-2" src={image.src} />
          </figure>
        </div>
      ))}
    </div>
  );
};
