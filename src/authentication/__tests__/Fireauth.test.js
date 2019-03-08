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

    await wait(() =>
      fireEvent.click(getByText('Signup'))
    ); /* NOTE: Waiting for verification email to be sent. */
    await waitForElement(() => getByText('Authenticating'));
    await waitForElement(() => getByText('Signup'));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup');
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
    expect(mockCalls[0][0].action).toBe('signup');
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
    expect(mockCalls[0][0].action).toBe('login');
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
});
