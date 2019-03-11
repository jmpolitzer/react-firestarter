import { useContext } from 'react';
import PropTypes from 'prop-types';
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
    logout,
    sendEmailVerification
  } = useContext(AuthContext);

  const signupUser = (values, context) => {
    signup(values, context, onSuccess, onError);
  };

  const loginUser = (values, context) => {
    login(values, context, onSuccess, onError);
  };

  const sendEmailVerificationToUser = context => {
    sendEmailVerification(context, onSuccess, onError);
  };

  return children({
    isAuthenticated,
    isAuthenticating,
    redirectToReferrer,
    getCurrentUser,
    signup: signupUser,
    login: loginUser,
    logout,
    sendEmailVerification: sendEmailVerificationToUser
  });
}

Authenticator.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func
};

export default Authenticator;
