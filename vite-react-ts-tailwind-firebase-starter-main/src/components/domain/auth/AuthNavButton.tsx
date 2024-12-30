import { useAuthState } from '~/components/contexts/UserContext';

export const AuthNavButton = () => {
  const { state } = useAuthState();

  if (state.state === 'SIGNED_IN') {
    return (
      <a href="/profile">
        <button className="btn btn-ghost px-4">Signed in as {state.currentUser.email}</button>
      </a>
    );
  }

  if (state.state === 'UNKNOWN') {
    // Prevents glitchy UI where you see signed out text briefly
    return null;
  }

  return (
    <a href="/profile">
      <button className="btn btn-ghost px-4">Click here to sign in</button>
    </a>
  );
};
