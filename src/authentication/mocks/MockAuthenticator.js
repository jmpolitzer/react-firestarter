import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  mockFireauthNoUser,
  mockFireauthUnverifiedUser,
  mockFireauthVerifiedUser
} from './mockFireauth';
import { AuthProvider, Authenticator } from '../index';

/* NOTE: Test redirectToReferrer */
function MockAuthenticator({ userType, onSuccess, onError }) {
  const getMockFireauthByUserType = () => {
    const types = {
      none: mockFireauthNoUser,
      unverified: mockFireauthUnverifiedUser,
      verified: mockFireauthVerifiedUser
    };

    return types[userType];
  };

  return (
    <AuthProvider fireauth={getMockFireauthByUserType()}>
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
              return <div>Loading</div>;
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
