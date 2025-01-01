import { User } from 'firebase/auth';
import { useState } from 'react';
import { Head } from '~/components/shared/Head';
import { useAuthState } from '../contexts/UserContext';
import { CreateAccountForm } from '../domain/auth/CreateAccountForm';
import { SignInForm } from '../domain/auth/SignInForm';
import { SignOutButton } from '../domain/auth/SignOutButton';
import { StartLabellingButton } from '../domain/label/StartLabellingButton';
import { Container } from '../shared/Container';

function SignedInProfile({ user }: { user: User }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4 ">Your Profile</h1>
      <p className="text-gray-600 mb-6">Welcome back! Here are your account details.</p>
      <div className="border-t border-gray-200 pt-4">
        <div className="mb-3">
          <span className="font-semibold text-gray-800">Email:</span> {user.email}
        </div>
        <div className="mb-3">
          <span className="font-semibold text-gray-800">User Since:</span>{' '}
          {user.metadata.creationTime && new Date(user.metadata.creationTime).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold text-gray-800">Last Sign In:</span>{' '}
          {user.metadata.lastSignInTime && new Date(user.metadata.lastSignInTime).toLocaleString()}
        </div>
      </div>
      <hr className="my-6 border-gray-300" />
      <div className="flex flex-col gap-4">
        <StartLabellingButton />
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

  return (
    <>
      <Head title="Profile" />
      <Container>
        {state.state == 'SIGNED_IN' ? <SignedInProfile user={state.currentUser} /> : <SignedOutProfile />}
      </Container>
    </>
  );
}

export default Profile;
