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

      // showMessage(_msg);

      onSuccess(_msg);
    } catch (error) {
      // handleFireAuthFormError(error, next);
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
          type: 'success',
          text: 'You have successfully logged in.'
        };

        onSuccess(_msg);
      } else {
        setIsAuthenticating(false);

        const _msg = {
          type: 'info',
          text: 'Check your email for registration confirmation.'
        };

        // showMessage(_msg);

        onSuccess(_msg);
      }
    } catch (error) {
      // handleFireAuthFormError(error, next);
      setIsAuthenticating(false);
      onError(error);
    }
  };

  const logout = () => {
    fireauth.signOut();

    setIsAuthenticated(false);
    setRedirectToReferrer(false);
  };

  // const handleFireAuthFormError = (error, next) => {
  //   setIsAuthenticating(false);
  //
  //   if (next) next(error);
  // };
  //
  // const showMessage = msg => {
  //   handleMessage && handleMessage(msg);
  // };

  useEffect(() => {
    const unsubscribe = fireauth.onAuthStateChanged(user => {
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
  }, [isAuthenticated]);

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
