import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useSignIn, useSignOut } from '~/components/contexts/UserContext';
import { Router } from '~/components/router/Router';
import { setupFirebase } from '~/lib/firebase';

function Main() {
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();
  useEffect(() => {
    setupFirebase();

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        signIn(user);
      } else {
        signOut();
      }
    });
  }, []);
  return (
    <main>
      <Router />
    </main>
  );
}

export default Main;
