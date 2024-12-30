import { useSearchParams } from 'react-router-dom';
import { Head } from '~/components/shared/Head';
import { LabelForId } from '../domain/label/LabelForId';
import { MissingLabelId } from '../domain/label/MissingLabelId';

function useIdFromUrl(): { labelId: string | null } {
  const [searchParams] = useSearchParams();

  if (searchParams.has('id')) {
    const labelId = searchParams.get('id');
    return { labelId };
  }

  return { labelId: null };
}

function Label() {
  const { labelId } = useIdFromUrl();

  return (
    <>
      <Head title="Label" />
      <div className="min-h-full p-8">
        <h1 className="text-3xl font-bold mb-2">Label the Whiteboard</h1>

        {labelId ? <LabelForId labelId={labelId} /> : <MissingLabelId />}
      </div>
    </>
  );
}

export default Label;
