import { useSearchParams } from 'react-router-dom';
import { Head } from '~/components/shared/Head';
import { useOnlyAllowSignedInUsers } from '../contexts/UserContext';
import { CropForId } from '../domain/crop/CropForId';
import { WhiteBoardPage } from '../domain/crop/WhiteBoardGallery';
import { Container } from '../shared/Container';

function useIdFromUrl(): { cropId: string | null; congratsCount: number } {
  const [searchParams, setSearchParams] = useSearchParams();

  let params = {};

  if (searchParams.has('id')) {
    const cropId = searchParams.get('id');
    params = { ...params, cropId };
  }

  let congratsCount = -1;
  if (searchParams.has('congratsCount')) {
    congratsCount = Number(searchParams.get('congratsCount'));

    // Delete 'congrats' after 2 seconds
    setTimeout(() => {
      searchParams.delete('congratsCount');
      setSearchParams(searchParams); // Update the URL without the 'congrats' parameter
    }, 1000 * 5);
  }

  return { cropId: null, congratsCount, ...params };
}

function Congrats({ congratsCount }: { congratsCount: number }) {
  return (
    congratsCount > 0 && (
      <div role="alert" className="alert alert-success absolute bottom-8 right-8 w-min">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="w-72">Way to label {congratsCount} pieces of data!</span>
      </div>
    )
  );
}

function Crop() {
  const { cropId, congratsCount } = useIdFromUrl();
  useOnlyAllowSignedInUsers(); // Kick users out if not signed in

  return (
    <>
      <Head title="Crop" />
      <Container>
        <h1 className="text-3xl font-bold mb-2">Crop the Whiteboard</h1>
        {cropId ? <CropForId labelId={cropId} /> : <WhiteBoardPage />}
        <Congrats congratsCount={congratsCount} />
      </Container>
    </>
  );
}

export default Crop;
