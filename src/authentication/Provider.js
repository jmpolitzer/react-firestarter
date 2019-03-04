import React, { useEffect, useState } from 'react';
import AuthContext from './context';

/*
  TODO:
    - save user separately upon signup
    - update email address
    - update password
    - update user's profile
    - send password reset email
    - reauthenticate user
    - reCaptcha for too many unsuccessful login attempts
*/

function AuthProvider(props) {
  const { fireauth, children } = props;

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
      await fireauth.currentUser.sendEmailVerification();

      const _msg = {
        action: 'signup',
        result: 'Check your email for registration confirmation.'
      };

      setIsAuthenticating(false);
      onSuccess(_msg);
    } catch (error) {
      setIsAuthenticating(false);
      onError(error);
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

      if (user.emailVerified) {
        setIsAuthenticated(true);
        setRedirectToReferrer(true);

        const _msg = {
          action: 'login',
          result: 'You have successfully logged in.'
        };

        setIsAuthenticating(false);
        onSuccess(_msg);
      } else {
        const _msg = {
          action: 'login',
          result: 'Check your email for registration confirmation.'
        };

        setIsAuthenticating(false);
        onSuccess(_msg);
      }
    } catch (error) {
      setIsAuthenticating(false);
      onError(error);
    }
  };

  const logout = () => {
    fireauth.signOut();

    setIsAuthenticated(false);
    setRedirectToReferrer(false);
  };

  useEffect(() => {
    const unsubscribe = fireauth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
        setRedirectToReferrer(true);
      }

      return function cleanup() {
        unsubscribe();
      };
    });
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

export default AuthProvider;
