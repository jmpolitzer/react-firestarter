import React from 'react';
import { cleanup, fireEvent, render, wait, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

import mockFirestore from '../mocks/mockFirestore';
import MockCollection from '../mocks/mockCollection';
import MockDocument from '../mocks/mockDocument';

afterEach(cleanup);

describe('Firestore Collection', () => {
  it('renders a toggleable loading indicator and a collection of documents', async () => {
    const { getByTestId, queryByTestId } = render(<MockCollection realtime={false} />);

    expect(getByTestId('loading')).toHaveTextContent('Loading');

    await waitForElement(() => getByTestId('todos-container'));

    expect(getByTestId('todos-container').children.length).toBe(2);
    expect(queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('defaults to using realtime snapshots', () => {
    const { getByTestId } = render(<MockCollection />);

    expect(getByTestId('todos-container').children.length).toBe(2);
  });
});

describe('Firestore Document', async () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  it('successfully adds a document', async () => {
    const { getByText } = render(<MockDocument onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Add')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('add');
    expect(mockCalls[0][0].result).toBe(123456);
  });
});
