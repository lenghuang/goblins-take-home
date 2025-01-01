import { Head } from '~/components/shared/Head';
import { useAuthState } from '../contexts/UserContext';
import { StartLabellingButton } from '../domain/label/StartLabellingButton';
import { Container } from '../shared/Container';

function DashboardOptions() {
  const { state } = useAuthState();

  if (state.state == 'SIGNED_IN') {
    return (
      <>
        <StartLabellingButton />
        or consider...
        <a href="/upload">
          <button className="btn w-full">Upload More Data</button>
        </a>
        <a href="/download">
          <button className="btn w-full">Download Labeled Data</button>
        </a>
      </>
    );
  } else if (state.state == 'SIGNED_OUT') {
    return (
      <a href="/profile">
        <button className="btn btn-primary text-white w-full">Start By Signing In</button>
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
      <Container>
        <h1 className="text-3xl font-bold mb-2">Home</h1>
        <p> Hello! What do you want to do today?</p>
        <div className="flex flex-col gap-4 p-8 text-center">
          <DashboardOptions />
        </div>
      </Container>
    </>
  );
}

export default Index;
