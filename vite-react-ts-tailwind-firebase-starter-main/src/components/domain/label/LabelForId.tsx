import { useGetDocData } from '~/lib/firestore';

interface LabelData {
  imageUrl: string;
  labelState: 0 | 1 | 2; // Unlabelled, Partially Labelled, Labelled
}

const useLabelData = (labelId: string): { data: LabelData | undefined; isLoading: boolean; isError: boolean } => {
  const { data, isLoading, isError } = useGetDocData('jobs', labelId);
  if (data?.imageUrl && data?.labelState <= 2 && data?.labelState >= 0) {
    return { data: data as LabelData, isLoading, isError };
  }

  return { data: undefined, isLoading: false, isError: true };
};

export function LabelForId({ labelId }: { labelId: string }) {
  const { data, isLoading, isError } = useLabelData(labelId);

  if (isLoading) {
    return <p> Loading... </p>;
  }

  if (isError || !data) {
    return <p className="text-red-500"> Something went wrong. </p>;
  }

  return (
    <div className="p-8 max-w-300">
      <img className="shadow-lg border-2" src={data.imageUrl}></img>
    </div>
  );
}
