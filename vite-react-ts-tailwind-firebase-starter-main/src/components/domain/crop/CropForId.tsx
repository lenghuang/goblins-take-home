import { useGetDocData } from '~/lib/firestore';
import { LabelData } from '~/types/labelData';
import CropPreview from './CropPreview/CropPreview';

const useLabelData = (labelId: string): { data: LabelData | undefined; isLoading: boolean; isError: boolean } => {
  const { data, isLoading, isError } = useGetDocData('jobs', labelId);

  if (!!data) {
    if (data?.imageUrl && data?.labelState <= 2 && data?.labelState >= 0) {
      return { data: data as LabelData, isLoading, isError };
    } else {
      return { data: undefined, isLoading, isError };
    }
  }

  return { data, isLoading, isError };
};

export function CropForId({ labelId }: { labelId: string }) {
  const { data, isLoading, isError } = useLabelData(labelId);

  if (isLoading) {
    return <p> Loading... </p>;
  }

  if (isError || !data) {
    return <p className="text-red-500"> Something went wrong. </p>;
  }

  if (data.labelState != 0) {
    return <p className="text-yellow-500"> This whiteboard is already done being labelled. </p>;
  }

  return (
    <div className="p-4 flex-col flex justify-center max-w-80">
      <CropPreview imgSrc={data.imageUrl} whiteBoardId={labelId} />
    </div>
  );
}
