import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './context';

/*
  TODO:
    - save user separately upon signup
    - update email address
    - update password
    - update user's profile
    - send password reset email
    - resent email verification
    - reauthenticate user
    - reCaptcha for too many unsuccessful login attempts
*/

function AuthProvider(props) {
  const { fireauth, verifyByEmail = true, children } = props;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const getCurrentUser = () => {
    return fireauth.currentUser;
  };

  const signup = async (values, onSuccess, onError) => {
    const { email, password } = values;

    setIsAuthenticating(true);

    try {
      await fireauth.createUserWithEmailAndPassword(email, password);

      if (verifyByEmail) {
        await fireauth.currentUser.sendEmailVerification();

        handleCallback(
          onSuccess,
          'signup',
          'Check your email for registration confirmation.'
        );
      } else {
        handleCallback(
          onSuccess,
          'signup',
          'Thanks for signing up. Please login to continue.'
        );
      }

      setIsAuthenticating(false);
    } catch (error) {
      setIsAuthenticating(false);
      handleCallback(onError, 'signup', error);
    }
  };

  const login = async (values, onSuccess, onError) => {
    setIsAuthenticating(true);

    const { email, password } = values;

    try {
      const { user } = await fireauth.signInWithEmailAndPassword(
        email,
        password
      );

      if (user.emailVerified || (user && !verifyByEmail)) {
        setIsAuthenticated(true);
        setRedirectToReferrer(true);
        setIsAuthenticating(false);
        handleCallback(onSuccess, 'login', 'You have successfully logged in.');
      } else {
        setIsAuthenticating(false);
        handleCallback(
          onSuccess,
          'login',
          'Check your email for registration confirmation.'
        );
      }
    } catch (error) {
      setIsAuthenticating(false);
      handleCallback(onError, 'login', error);
    }
  };

  const logout = () => {
    fireauth.signOut();

    setIsAuthenticated(false);
    setRedirectToReferrer(false);
  };

  const handleCallback = (next, action, result) => {
    next({ action, result });
  };

  useEffect(() => {
    const unsubscribe = fireauth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
        setRedirectToReferrer(true);
      }
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        isAuthenticating: isAuthenticating,
        redirectToReferrer: redirectToReferrer,
        getCurrentUser: getCurrentUser,
        signup: signup,
        login: login,
        logout: logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  fireauth: PropTypes.object,
  children: PropTypes.object,
  verifyByEmail: PropTypes.bool
};

export default AuthProvider;
