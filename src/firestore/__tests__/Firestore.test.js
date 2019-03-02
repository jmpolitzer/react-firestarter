import React from 'react';
import { cleanup, fireEvent, render, wait, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

import mockFirestore from '../mocks/mockFirestore';
import MockCollection from '../mocks/mockCollection';
import MockDocument from '../mocks/mockDocument';

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

afterEach(() => {
  cleanup();

  mockOnSuccess.mockClear();
  mockOnError.mockClear();
});

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
  it('successfully adds a document', async () => {
    const { getByText } = render(<MockDocument onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Add')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('add');
    expect(mockCalls[0][0].result).toBe(123456);
  });

  it('successfully removes a document', async () => {
    const { getByText } = render(<MockDocument id={654321} onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Remove')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('delete');
    expect(mockCalls[0][0].result).toBe('Document 654321 successfully deleted.');
  });
});
