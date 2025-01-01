import { useSearchParams } from 'react-router-dom';
import { Head } from '~/components/shared/Head';
import { useOnlyAllowSignedInUsers } from '../contexts/UserContext';
import { LabelForId } from '../domain/label/LabelForId';
import { Container } from '../shared/Container';

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
  useOnlyAllowSignedInUsers(); // Kick users out if not signed in

  return (
    <>
      <Head title="Label" />
      <Container>
        <h1 className="text-3xl font-bold mb-2">Label the Whiteboard</h1>
        {labelId ? (
          <LabelForId labelId={labelId} />
        ) : (
          <div className="flex gap-4 flex-col">
            <p> Choose a cropped image to label </p>
            <a href={`/crop`}>
              <button className="btn">Create Cropped Images</button>
            </a>
          </div>
        )}
      </Container>
    </>
  );
}

export default Label;
