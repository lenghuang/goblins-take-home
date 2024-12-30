import { useAuth } from '~/lib/firebase';

type Props = {};

export const SignOutButton = (props: Props) => {
  const handleClick = async () => {
    const auth = await useAuth();
    auth.signOut();
  };

  return (
    <button onClick={handleClick} type="button" className="btn normal-case">
      Sign Out
    </button>
  );
};
