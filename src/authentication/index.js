import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { firebase } from '../init';

const fireAuth = firebase.auth();
const AuthContext = React.createContext();

/*
  TODO:
    - update email address
    - update password
    - update user's profile
    - send password reset email
    - reauthenticate user
    - reCaptcha for too many unsuccessful login attempts
*/

function AuthProvider(props) {
  const { children, handleMessage } = props;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const getCurrentUser = () => {
    return fireAuth.currentUser;
  };

  const signup = async (values, next) => {
    const { email, password } = values;

    setIsAuthenticating(true);

    try {
      await fireAuth.createUserWithEmailAndPassword(email, password);
      await fireAuth.currentUser.sendEmailVerification();

      const _msg = {
        type: 'info',
        text: 'Check your email for registration confirmation.'
      };

      showMessage(_msg);

      next();
    } catch (error) {
      handleFireAuthFormError(error, next);
    }
  };

  const login = async (values, next) => {
    setIsAuthenticating(true);

    const { email, password } = values;

    try {
      const { user } = await fireAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (user.emailVerified) {
        setIsAuthenticated(true);
        setRedirectToReferrer(true);
      } else {
        setIsAuthenticating(false);

        const _msg = {
          type: 'info',
          text: 'Check your email for registration confirmation.'
        };

        showMessage(_msg);

        next();
      }
    } catch (error) {
      handleFireAuthFormError(error, next);
    }
  };

  const logout = () => {
    fireAuth.signOut();

    setIsAuthenticated(false);
    setRedirectToReferrer(false);
  };

  const handleFireAuthFormError = (error, next) => {
    setIsAuthenticating(false);

    if (next) next(error);
  };

  const showMessage = msg => {
    handleMessage && handleMessage(msg);
  };

  useEffect(
    () => {
      const unsubscribe = fireAuth.onAuthStateChanged(user => {
        if (user) {
          setIsAuthenticating(false);

          if (user.emailVerified) {
            setIsAuthenticated(true);
            setRedirectToReferrer(true);
          }
        }

        return function cleanup() {
          unsubscribe();
        };
      });
    },
    [isAuthenticated]
  );

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

export { AuthContext, AuthProvider };
