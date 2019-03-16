import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  wait,
  waitForElement
} from 'react-testing-library';
import 'jest-dom/extend-expect';

import MockAuthenticator from '../__mocks__/MockAuthenticator';

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

afterEach(() => {
  cleanup();

  mockOnSuccess.mockClear();
  mockOnError.mockClear();
});

describe('Firebase Authenticator', () => {
  it('renders a signup and login button if a user is not authenticated', () => {
    const { getByText, queryByText } = render(
      <MockAuthenticator userType='none' />
    );

    expect(getByText('Signup')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
    expect(queryByText('Logout')).not.toBeInTheDocument();
  });

  it('signs up a user and sends an email verification', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Signup'));

    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Signup'));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup-verify');
    expect(mockCalls[0][0].result).toContain(
      'Check your email for registration confirmation.'
    );
  });

  it('signs up a user and does not send an email verification if AuthProvider verifyByEmail prop is set to false', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        verifyByEmail={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Signup'));

    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Signup'));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup-no-verify');
    expect(mockCalls[0][0].result).toContain(
      'Thanks for signing up. Please login to continue.'
    );
  });

  it('creates a separate user model on signup if mergeUser prop is true', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        mergeUser={true}
        verifyByEmail={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Signup'));

    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Signup'));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup-no-verify');
    expect(mockCalls[0][0].result).toContain(
      'Thanks for signing up. Please login to continue.'
    );
  });

  it('returns an error if there is a problem signing up', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='none'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Signup')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup');
    expect(mockCalls[0][0].result.message).toContain(
      'We had trouble signing you up.'
    );
  });

  it('does not login an unverified user', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Login'));
    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Login'));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('login-not-verified');
    expect(mockCalls[0][0].result).toContain(
      'Check your email for registration confirmation.'
    );
  });

  it('logs in an unverified user if AuthProvider verifyByEmail prop is set to false', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        verifyByEmail={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Login'));

    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Logout'));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('login');
    expect(mockCalls[0][0].result).toContain(
      'You have successfully logged in.'
    );
  });

  it('logs in a verified user', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='verified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Login'));

    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Logout'));

    getByText('I should redirect to the referring url.');

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('login');
    expect(mockCalls[0][0].context.value).toBe('ima context');
    expect(mockCalls[0][0].result).toContain(
      'You have successfully logged in.'
    );
  });

  it('returns an error if there is a problem logging in', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='verified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Login')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('login');
    expect(mockCalls[0][0].result.message).toContain(
      'We had trouble logging you in.'
    );
  });

  it('does not return an error if there is a problem logging in and no onError prop is passed', async () => {
    const { getByText } = render(
      <MockAuthenticator userType='verified' onSuccess={mockOnSuccess} error />
    );

    await wait(() => fireEvent.click(getByText('Login')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(0);
  });

  it('saves the logged in state of a user', () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedIn'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(getByText('turd@ferguson.com')).toBeInTheDocument();
    expect(getByText('Logout')).toBeInTheDocument();
  });

  it('fetches user model if mergeUser prop is true', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedIn'
        mergeUser={true}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await waitForElement(() => getByText('Turd Ferguson'));

    expect(getByText('Logout')).toBeInTheDocument();
  });

  it('logs out a user', () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedIn'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(getByText('Logout'));

    expect(getByText('Login')).toBeInTheDocument();
  });

  it('sends an additional email verification if requested', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Send Email Verification')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup-verify');
    expect(mockCalls[0][0].result).toContain(
      'Check your email for registration confirmation.'
    );
  });

  it('returns an error if there is a problem re-sending additional email verification', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverifiedError'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Send Email Verification')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup-verify');
    expect(mockCalls[0][0].result.message).toContain(
      'There was a problem sending your email verification. Please try again.'
    );
  });

  it('will not try and re-send an email verificatin if currentUser does not exist', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='none'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Send Email Verification')));

    const mockOnSuccessCalls = mockOnSuccess.mock.calls;
    const mockOnErrorCalls = mockOnError.mock.calls;

    expect(mockOnSuccessCalls.length).toBe(0);
    expect(mockOnErrorCalls.length).toBe(0);
  });

  it('sends password reset email', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='verified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Reset Password')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('password-reset');
    expect(mockCalls[0][0].result).toContain(
      'Check your email to reset your password.'
    );
  });

  it('returns an error if there is a problem sending a password reset email', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='verified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Reset Password')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('password-reset');
    expect(mockCalls[0][0].result.message).toContain(
      'We had trouble sending a password reset email.'
    );
  });

  it('updates email', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedIn'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Update Email')));
    await wait(() => {});

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update-email');
    expect(mockCalls[0][0].result).toContain('Your email has been updated.');
  });

  it('returns an error if there is a problem updating email', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedInError'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Update Email')));
    await wait(() => {});

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update-email');
    expect(mockCalls[0][0].result.message).toContain(
      'There was a problem updating your email.'
    );
  });

  it('returns an error if a user does not successfully reauthenticate before updating email', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedInUnReauthenticatedError'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Update Email')));
    await wait(() => {});

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update-email');
    expect(mockCalls[0][0].result.message).toContain(
      'There was a problem reauthenticating the current user.'
    );
  });

  it('updates password', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedIn'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Update Password')));
    await wait(() => {});

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update-password');
    expect(mockCalls[0][0].result).toContain('Your password has been updated.');
  });

  it('returns an error if there is a problem updating password', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedInError'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Update Password')));
    await wait(() => {});

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update-password');
    expect(mockCalls[0][0].result.message).toContain(
      'There was a problem updating your password.'
    );
  });

  it('returns an error if a user does not successfully reauthenticate before updating password', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='loggedInUnReauthenticatedError'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        error
      />
    );

    await wait(() => fireEvent.click(getByText('Update Password')));
    await wait(() => {});

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update-password');
    expect(mockCalls[0][0].result.message).toContain(
      'There was a problem reauthenticating the current user.'
    );
  });
});
