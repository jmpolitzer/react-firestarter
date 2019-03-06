import { useContext } from 'react';
import AuthContext from './context';

function Authenticator(props) {
  const { children, onSuccess, onError } = props;

  const {
    isAuthenticated,
    isAuthenticating,
    redirectToReferrer,
    getCurrentUser,
    signup,
    login,
    logout
  } = useContext(AuthContext);

  const signupUser = values => {
    signup(values, onSuccess, onError);
  };

  const loginUser = values => {
    login(values, onSuccess, onError);
  };

  return children({
    isAuthenticated,
    isAuthenticating,
    redirectToReferrer,
    getCurrentUser,
    signup: signupUser,
    login: loginUser,
    logout
  });
}

export default Authenticator;
