import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './context';

function AuthProvider(props) {
  const { fireauth, verifyByEmail = true, mergeUser = false, children } = props;
  const db = fireauth.app.firebase_.firestore();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('react-firestarter-authenticated')
  );
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const createDbUser = async (authUser, values) => {
    const {
      user: { uid, email }
    } = authUser;
    const user = { uid, email, ...values };

    await db
      .collection('users')
      .doc(uid)
      .set(user);
  };

  const mergeDbUser = async authUser => {
    const { uid } = authUser;

    await db
      .collection('users')
      .doc(uid)
      .get()
      .then(dbUser => {
        if (dbUser.exists) {
          setCurrentUser(dbUser.data());
        } else {
          setCurrentUser(authUser);
        }
      });
  };

  const getCurrentUser = () => {
    return currentUser;
  };

  const signup = async (credential, user, context, onSuccess, onError) => {
    setIsAuthenticating(true);

    try {
      const { email, password } = credential;

      const authUser = await fireauth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (mergeUser) createDbUser(authUser, user, onError);

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

    localStorage.removeItem('react-firestarter-authenticated');
    setIsAuthenticated(false);
    setRedirectToReferrer(false);
  };

  const sendEmailVerification = async (context, onSuccess, onError) => {
    const user = fireauth.currentUser;

    if (user) {
      try {
        await user.sendEmailVerification();

        logout(); /* Calling logout here allows onAuthStateChanged to be called on the first login. */

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
    setIsAuthenticating(true);

    try {
      await fireauth.sendPasswordResetEmail(email);

      setIsAuthenticating(false);
      handleCallback(
        onSuccess,
        'password-reset',
        'Check your email to reset your password.',
        context
      );
    } catch (error) {
      setIsAuthenticating(false);
      handleCallback(onError, 'password-reset', error, context);
    }
  };

  const updateEmail = async (
    newEmail,
    password,
    context,
    onSuccess,
    onError
  ) => {
    const user = fireauth.currentUser;

    try {
      await reauthenticate(password);
      await user.updateEmail(newEmail);

      if (verifyByEmail) sendEmailVerification(context, onSuccess, onError);

      logout();

      handleCallback(
        onSuccess,
        'update-email',
        `Your email has been updated. Please ${verifyByEmail && 'check your email to verify this update and'} login to continue.`,
        context
      );
    } catch (error) {
      handleCallback(onError, 'update-email', error, context);
    }
  };

  const updatePassword = async (
    password,
    newPassword,
    context,
    onSuccess,
    onError
  ) => {
    const user = fireauth.currentUser;

    try {
      await reauthenticate(password);
      await user.updatePassword(newPassword);

      handleCallback(
        onSuccess,
        'update-password',
        'Your password has been updated.',
        context
      );
    } catch (error) {
      handleCallback(onError, 'update-password', error, context);
    }
  };

  const reauthenticate = password => {
    const user = fireauth.currentUser;
    const { email } = user;
    const getCredential = fireauth.app.firebase_.auth.EmailAuthProvider.credential;
    const credential = getCredential(email, password);

    return new Promise((resolve, reject) => {
      user
        .reauthenticateAndRetrieveDataWithCredential(credential)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  };

  const handleCallback = (next, action, result, context) => {
    if (next) next({ action, result, context });
  };

  useEffect(() => {
    const unsubscribe = fireauth.onAuthStateChanged(user => {
      if (user && (user.emailVerified || !verifyByEmail)) {
        localStorage.setItem('react-firestarter-authenticated', true);
        setIsAuthenticated(
          localStorage.getItem('react-firestarter-authenticated')
        );
        setRedirectToReferrer(true);

        if (mergeUser) {
          mergeDbUser(user);
        } else {
          setCurrentUser(user);
        }
      }
    });

    return function cleanup() {
      localStorage.removeItem('react-firestarter-authenticated');
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
        sendPasswordResetEmail,
        updateEmail,
        updatePassword
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
