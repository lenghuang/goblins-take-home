import { useAuthState } from '~/components/contexts/UserContext';

export const AuthNavButton = () => {
  const { state } = useAuthState();

  console.log(state);

  if (state.state === 'SIGNED_IN') {
    return <span>Whiteboard Labelling Platform</span>;
  }

  return <button className="btn btn-ghost px-4">Click here to sign in</button>;
};
