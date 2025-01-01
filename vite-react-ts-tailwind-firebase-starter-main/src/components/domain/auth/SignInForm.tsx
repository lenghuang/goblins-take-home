import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useAuth } from '~/lib/firebase';

interface SignInFormProps {
  goToCreateAccountCallback: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ goToCreateAccountCallback }) => {
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
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign-in successful!');
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
      <h2 className="text-2xl font-bold">Sign In</h2>
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
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
      <button onClick={goToCreateAccountCallback} className={`btn w-full`} disabled={loading}>
        {'Create Account Instead'}
      </button>
    </form>
  );
};
