export const CroppedImages = ({ croppedImages }: { croppedImages: Array<HTMLImageElement> }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {croppedImages?.map((image, i) => (
        <div
          key={`Cropped_Images_${i}`}
          className="card card-compact bg-base-100 h-min w-84 border-2 border-b-0 shadow-xl"
        >
          <figure className="border-b-2">
            <img className="p-2" src={image.src} />
          </figure>
          <div className="card-body flex flex-row justify-center">
            <button className="btn btn-sm btn-warning btn-outline">Undo Selection</button>
          </div>
        </div>
      ))}
    </div>
  );
};
