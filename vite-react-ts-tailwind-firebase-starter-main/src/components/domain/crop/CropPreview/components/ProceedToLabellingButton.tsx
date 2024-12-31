export const ProceedToLabellingButton = ({ croppedImages }: { croppedImages: Array<HTMLImageElement> }) => {
  // Here, move to label?id page with all chunks that are not labelled yet
  // Also, need to upload chunks to cloud before doing so
  // Display a nice little loading UI
  const active = croppedImages?.length > 0;

  return (
    <button disabled={!active} className={`btn btn-primary w-full ${active ? '' : 'disabled'}`}>
      Proceed To Labelling
    </button>
  );
};
