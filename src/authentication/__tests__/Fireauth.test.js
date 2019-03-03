import React from 'react';
import { cleanup, fireEvent, render, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';

import MockAuthenticator from '../mocks/mockAuthenticator';

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

  it('sends the users an email verification email upon signup and does not log them in', async () => {
    const { getByText } = render(
      <MockAuthenticator
        userType='unverified'
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await wait(() => fireEvent.click(getByText('Signup')));
    await wait(() => {});

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('signup');
    expect(mockCalls[0][0].result).toContain(
      'Check your email for registration confirmation.'
    );
  });
});
