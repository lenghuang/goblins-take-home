import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useAuth } from '~/lib/firebase';

interface CreateAccountFormProps {
  goToSignInCallback: () => void; // Define the callback type
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ goToSignInCallback }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const auth = await useAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Create-account successful!');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 max-w-md mx-auto border rounded shadow min-w-80 w-3/4"
    >
      <h2 className="text-2xl font-bold">Create Account</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <button
        type="submit"
        className={`btn btn-primary text-white w-full ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
      <button onClick={goToSignInCallback} className={`btn w-full`} disabled={loading}>
        {'Sign in instead'}
      </button>
    </form>
  );
};
