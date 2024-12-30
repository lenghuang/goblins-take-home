import { useState } from 'react';
import { Head } from '~/components/shared/Head';
import { useAuthState } from '../contexts/UserContext';
import { CreateAccountForm } from '../domain/auth/CreateAccountForm';
import { SignInForm } from '../domain/auth/SignInForm';
import { SignOutButton } from '../domain/auth/SignOutButton';

function SignedInProfile() {
  return (
    <>
      <p> Here you can find information about your profile.</p>
      <div className="text-center hero-content">
        <SignOutButton />
      </div>
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

  console.log(state);

  return (
    <>
      <Head title="Profile" />
      <div className="min-h-full p-8">{state.state == 'SIGNED_IN' ? <SignedInProfile /> : <SignedOutProfile />}</div>
    </>
  );
}

export default Profile;
