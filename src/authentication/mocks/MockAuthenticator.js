import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import mockFireauth from './mockFireauth';
import { AuthProvider, Authenticator } from '../index';

/* NOTE: Test redirectToReferrer & no email verification */
function MockAuthenticator({ userType, onSuccess, onError }) {
  return (
    <AuthProvider fireauth={mockFireauth(userType)}>
      <Authenticator onSuccess={onSuccess} onError={onError}>
        {({
          isAuthenticated,
          isAuthenticating,
          redirectToReferrer,
          getCurrentUser,
          signup,
          login,
          logout
        }) => {
          if (isAuthenticated) {
            return (
              <Fragment>
                <button onClick={logout}>Logout</button>
              </Fragment>
            );
          } else {
            if (isAuthenticating) {
              return <div>Authenticating</div>;
            } else {
              return (
                <Fragment>
                  <button onClick={signup}>Signup</button>
                  <button onClick={login}>Login</button>
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
  userType: PropTypes.string.isRequired
};

export default MockAuthenticator;
