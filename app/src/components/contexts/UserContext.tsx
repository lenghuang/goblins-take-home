import { User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthActions = { type: 'SIGN_IN'; payload: { user: User } } | { type: 'SIGN_OUT' };

type AuthState =
  | {
      state: 'SIGNED_IN';
      currentUser: User;
    }
  | {
      state: 'SIGNED_OUT';
    }
  | {
      state: 'UNKNOWN';
    };

const AuthReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        state: 'SIGNED_IN',
        currentUser: action.payload.user,
      };
    case 'SIGN_OUT':
      return {
        state: 'SIGNED_OUT',
      };
  }
};

type AuthContextProps = {
  state: AuthState;
  dispatch: (value: AuthActions) => void;
};

export const AuthContext = createContext<AuthContextProps>({ state: { state: 'UNKNOWN' }, dispatch: (val) => {} });

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, { state: 'UNKNOWN' });

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

const useAuthState = () => {
  const { state } = useContext(AuthContext);
  return {
    state,
  };
};

const useSignIn = () => {
  const { dispatch } = useContext(AuthContext);
  return {
    signIn: (user: User) => {
      dispatch({ type: 'SIGN_IN', payload: { user } });
    },
  };
};

const useSignOut = () => {
  const { dispatch } = useContext(AuthContext);
  return {
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' });
    },
  };
};

const useOnlyAllowSignedInUsers = () => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  if (state.state === 'SIGNED_OUT') {
    navigate('/profile');
  }
};

const useUserEmail = () => {
  const { state } = useContext(AuthContext);
  if (state.state == 'SIGNED_IN') {
    return state.currentUser.email;
  } else {
    return '';
  }
};

export { AuthProvider, useAuthState, useOnlyAllowSignedInUsers, useSignIn, useSignOut, useUserEmail };
