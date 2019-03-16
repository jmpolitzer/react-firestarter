import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { mockFireauth, mockFireauthError } from './mockFireauth';
import { AuthProvider, Authenticator } from '../../index';

function MockAuthenticator({
  userType,
  mergeUser,
  verifyByEmail,
  onSuccess,
  onError,
  error
}) {
  return (
    <AuthProvider
      fireauth={error ? mockFireauthError(userType) : mockFireauth(userType)}
      mergeUser={mergeUser}
      verifyByEmail={verifyByEmail}
    >
      <Authenticator onSuccess={onSuccess} onError={onError}>
        {({
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
        }) => {
          if (isAuthenticated) {
            return (
              <Fragment>
                <div>{getCurrentUser() && getCurrentUser().name}</div>
                <div>{getCurrentUser() && getCurrentUser().email}</div>
                <div>{`I should ${
                  !redirectToReferrer ? 'not ' : ''
                }redirect to the referring url.`}</div>
                <button onClick={logout}>Logout</button>
                <button onClick={updateEmail}>Update Email</button>
                <button onClick={updatePassword}>Update Password</button>
              </Fragment>
            );
          } else {
            if (isAuthenticating) {
              return <div>Authenticating</div>;
            } else {
              return (
                <Fragment>
                  <button onClick={signup}>Signup</button>
                  <button onClick={() => login({}, { value: 'ima context' })}>
                    Login
                  </button>
                  <button onClick={sendEmailVerification}>
                    Send Email Verification
                  </button>
                  <button onClick={() => sendPasswordResetEmail()}>
                    Reset Password
                  </button>
                </Fragment>
              );
            }
          }
        }}
      </Authenticator>
    </AuthProvider>
  );
}

MockAuthenticator.propTypes = {
  userType: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  error: PropTypes.bool
};

export default MockAuthenticator;
