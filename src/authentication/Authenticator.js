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
    currentUser,
    signup,
    login,
    logout,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword
  } = useContext(AuthContext);

  const signupUser = (values, context) => {
    const { email, password, ...user } = values;
    const credential = { email, password };

    signup(credential, user, context, onSuccess, onError);
  };

  const loginUser = (values, context) => {
    login(values, context, onSuccess, onError);
  };

  const sendEmailVerificationToUser = context => {
    sendEmailVerification(context, onSuccess, onError);
  };

  const sendPasswordResetEmailToUser = (email, context) => {
    sendPasswordResetEmail(email, context, onSuccess, onError);
  };

  const updateEmailForUser = (password, newEmail, context) => {
    updateEmail(password, newEmail, context, onSuccess, onError);
  };

  const updatePasswordForUser = (password, newPassword, context) => {
    updatePassword(password, newPassword, context, onSuccess, onError);
  };

  return children({
    isAuthenticated,
    isAuthenticating,
    redirectToReferrer,
    getCurrentUser,
    currentUser,
    signup: signupUser,
    login: loginUser,
    logout,
    sendEmailVerification: sendEmailVerificationToUser,
    sendPasswordResetEmail: sendPasswordResetEmailToUser,
    updateEmail: updateEmailForUser,
    updatePassword: updatePasswordForUser
  });
}

Authenticator.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func
};

export default Authenticator;
