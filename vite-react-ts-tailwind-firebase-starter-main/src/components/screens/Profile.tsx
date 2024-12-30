import { User } from 'firebase/auth';
import { useState } from 'react';
import { Head } from '~/components/shared/Head';
import { useAuthState } from '../contexts/UserContext';
import { CreateAccountForm } from '../domain/auth/CreateAccountForm';
import { SignInForm } from '../domain/auth/SignInForm';
import { SignOutButton } from '../domain/auth/SignOutButton';

function SignedInProfile({ user }: { user: User }) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p> Welcome back! Here are your details</p>
      <hr className="m-4" />
      <p> Email: {user.email} </p>
      <p> User Since: {user.metadata.creationTime} </p>
      <p> Last Sign In: {user.metadata.lastSignInTime} </p>
      <hr className="m-4" />
      <SignOutButton />
    </>
  );
}

function SignedOutProfile() {
  // In hindsight, these probably should have been separate routes rather than views managed with react state.
  // This may make deep linking directly to create account harder in the future, for example, in an new contractor
  // onboarding session.
  const [showSignIn, setShowSignIn] = useState(true);
  return (
    <div className="flex justify-center ">
      {showSignIn ? (
        <SignInForm goToCreateAccountCallback={() => setShowSignIn(false)} />
      ) : (
        <CreateAccountForm goToSignInCallback={() => setShowSignIn(true)} />
      )}
    </div>
  );
}

function Profile() {
  const { state } = useAuthState();

  return (
    <>
      <Head title="Profile" />
      <div className="min-h-full p-8">
        {state.state == 'SIGNED_IN' ? <SignedInProfile user={state.currentUser} /> : <SignedOutProfile />}
      </div>
    </>
  );
}

export default Profile;
