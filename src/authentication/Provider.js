import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './context';

/*
  TODO:
    - save user separately upon signup
    - update email address
    - update password
    - update user's profile
    - reauthenticate user
    - reCaptcha for too many unsuccessful login attempts\
    - add authorization
*/

function AuthProvider(props) {
  const { fireauth, verifyByEmail = true, mergeUser = false, children } = props;
  const { firestore: db } = fireauth.app.firebase_;
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const createDbUser = async (authUser, values) => {
    const { uid } = authUser;
    const user = { uid, ...values };

    await db
      .collection('users')
      .doc(uid)
      .set(user)
      .then(newDbUser => {
        setCurrentUser(newDbUser);
      });
  };

  const mergeDbUser = async authUser => {
    const { uid } = authUser;

    await db
      .collection('users')
      .doc(uid)
      .get()
      .then(dbUser => {
        setCurrentUser(dbUser);
      });
  };

  const getCurrentUser = () => {
    return currentUser;
  };

  const signup = async (values, context, onSuccess, onError) => {
    setIsAuthenticating(true);

    try {
      const { password, ...user } = values;
      const { email } = user;

      const authUser = await fireauth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (mergeUser) createDbUser(authUser, values, onError);

      if (verifyByEmail) {
        sendEmailVerification(context, onSuccess, onError);
      } else {
        handleCallback(
          onSuccess,
          'signup-no-verify',
          'Thanks for signing up. Please login to continue.',
          context
        );
      }

      setIsAuthenticating(false);
    } catch (error) {
      setIsAuthenticating(false);
      handleCallback(onError, 'signup', error, context);
    }
  };

  const login = async (values, context, onSuccess, onError) => {
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
        handleCallback(
          onSuccess,
          'login',
          'You have successfully logged in.',
          context
        );
      } else {
        setIsAuthenticating(false);
        handleCallback(
          onSuccess,
          'login-not-verified',
          'Check your email for registration confirmation.',
          context
        );
      }
    } catch (error) {
      setIsAuthenticating(false);
      handleCallback(onError, 'login', error, context);
    }
  };

  const logout = () => {
    fireauth.signOut();

    setIsAuthenticated(false);
    setRedirectToReferrer(false);
  };

  const sendEmailVerification = async (context, onSuccess, onError) => {
    const user = fireauth.currentUser;

    if (user) {
      try {
        await user.sendEmailVerification();

        handleCallback(
          onSuccess,
          'signup-verify',
          'Check your email for registration confirmation.',
          context
        );
      } catch (error) {
        handleCallback(onError, 'signup-verify', error, context);
      }
    }
  };

  const sendPasswordResetEmail = async (email, context, onSuccess, onError) => {
    try {
      await fireauth.sendPasswordResetEmail(email);

      handleCallback(
        onSuccess,
        'password-reset',
        'Check your email to reset your password.',
        context
      );
    } catch (error) {
      handleCallback(onError, 'password-reset', error, context);
    }
  };

  const handleCallback = (next, action, result, context) => {
    if (next) next({ action, result, context });
  };

  useEffect(() => {
    const unsubscribe = fireauth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
        setRedirectToReferrer(true);

        if (mergeUser) {
          mergeDbUser(user);
        } else {
          setCurrentUser(user);
        }
      }
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        redirectToReferrer,
        getCurrentUser,
        signup,
        login,
        logout,
        sendEmailVerification,
        sendPasswordResetEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  fireauth: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  verifyByEmail: PropTypes.bool,
  mergeUser: PropTypes.bool
};

export default AuthProvider;
