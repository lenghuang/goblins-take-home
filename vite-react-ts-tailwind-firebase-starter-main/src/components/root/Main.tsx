import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useSignIn, useSignOut } from '~/components/contexts/UserContext';
import { Router } from '~/components/router/Router';
import { setupFirebase, useAuth } from '~/lib/firebase';

function Main() {
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  useEffect(() => {
    const setupAuth = async () => {
      setupFirebase();
      const auth = await useAuth();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          signIn(user);
        } else {
          signOut();
        }
      });
    };

    setupAuth();
  }, []); // Empty dependency array to run only once on mount

  return (
    <main>
      <Router /> {/* Render the router */}
    </main>
  );
}

export default Main;
