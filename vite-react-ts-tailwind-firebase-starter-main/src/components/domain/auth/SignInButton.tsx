import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useAuth } from '~/lib/firebase';

export const SignInButton = () => {
  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    const auth = await useAuth();
    // @see https://firebase.google.com/docs/auth/web/google-signin
    signInWithRedirect(auth, provider);
  };

  return (
    <button onClick={handleClick} type="button" className="btn text-white btn-primary normal-case min-w-60 w-full">
      Sign In With Google
    </button>
  );
};
