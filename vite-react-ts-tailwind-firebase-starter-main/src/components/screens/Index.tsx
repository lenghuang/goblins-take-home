import { Head } from '~/components/shared/Head';
import { useAuthState } from '../contexts/UserContext';

function DashboardOptions() {
  const { state } = useAuthState();

  if (state.state == 'SIGNED_IN') {
    return (
      <>
        <a href="/label">
          <button className="btn btn-primary w-full">Start Labelling</button>
        </a>
        or consider...
        <a href="/todo">
          <button className="btn btn-outline btn-primary w-full">Upload More Data</button>
        </a>
        <a href="/todo">
          <button className="btn btn-outline btn-primary w-full">View Labeled Data</button>
        </a>
      </>
    );
  } else if (state.state == 'SIGNED_OUT') {
    return (
      <a href="/profile">
        <button className="btn btn-primary w-full">Start By Signing In</button>
      </a>
    );
  } else {
    return <p>Loading...</p>;
  }
}

function Index() {
  return (
    <>
      <Head title="Home" />
      <div className="min-h-full p-8">
        <h1 className="text-3xl font-bold mb-2">Home</h1>
        <p> Hello! What do you want to do today?</p>
        <div className="flex flex-col gap-4 p-8 text-center">
          <DashboardOptions />
        </div>
      </div>
    </>
  );
}

export default Index;
