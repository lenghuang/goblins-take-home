import { useSearchParams } from 'react-router-dom';
import { Head } from '~/components/shared/Head';
import { useOnlyAllowSignedInUsers } from '../contexts/UserContext';
import { CropForId } from '../domain/crop/CropForId';
import { MissingCropId } from '../domain/crop/MissingCropId';

function useIdFromUrl(): { cropId: string | null } {
  const [searchParams] = useSearchParams();

  if (searchParams.has('id')) {
    const cropId = searchParams.get('id');
    return { cropId };
  }

  return { cropId: null };
}

function Crop() {
  const { cropId } = useIdFromUrl();
  useOnlyAllowSignedInUsers(); // Kick users out if not signed in

  return (
    <>
      <Head title="Crop" />
      <div className="min-h-full p-8">
        <h1 className="text-3xl font-bold mb-2">Label the Whiteboard</h1>
        {cropId ? <CropForId labelId={cropId} /> : <MissingCropId />}
      </div>
    </>
  );
}

export default Crop;
