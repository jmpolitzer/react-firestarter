import React from 'react';
import { cleanup, fireEvent, render, wait, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

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
    const { getByText, getByTestId, queryByText } = render(<MockCollection realtime={false} />);

    expect(getByText('Loading')).toBeInTheDocument();

    await waitForElement(() => getByTestId('todos-container'));

    expect(getByText('first todo')).toBeInTheDocument();
    expect(getByText('second todo')).toBeInTheDocument();
    expect(queryByText('Loading')).not.toBeInTheDocument();
  });

  it('defaults to using realtime snapshots', () => {
    const { getByText } = render(<MockCollection />);

    expect(getByText('first todo')).toBeInTheDocument();
    expect(getByText('second todo')).toBeInTheDocument();
  });

  it('returns an error if there is a problem getting all documents', async () => {
    const { getByText } = render(<MockCollection error realtime={false} onError={mockOnError} />);

    await wait(() => {});

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('getAll');
    expect(mockCalls[0][0].result).toContain('Error getting documents');
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

  it('returns an error if there is a problem adding a document', async () => {
    const { getByText } = render(<MockDocument error onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Add')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('add');
    expect(mockCalls[0][0].result).toContain('Error adding document');
  });

  it('successfully removes a document', async () => {
    const { getByText } = render(<MockDocument id={654321} onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Remove')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('delete');
    expect(mockCalls[0][0].result).toBe('Document 654321 successfully deleted.');
  });

  it('returns an error if there is a problem removing a document', async () => {
    const { getByText } = render(<MockDocument error onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Remove')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('delete');
    expect(mockCalls[0][0].result).toContain('Error deleting document');
  });

  it('successfully updates a document', async () => {
    const { getByText } = render(<MockDocument id={654321} onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Update')));

    const mockCalls = mockOnSuccess.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update');
    expect(mockCalls[0][0].result).toBe('Document 654321 successfully updated.');
  });

  it('returns an error if there is a problem updating a document', async () => {
    const { getByText } = render(<MockDocument error onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => fireEvent.click(getByText('Update')));

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('update');
    expect(mockCalls[0][0].result).toContain('Error updating document');
  });

  it('successfully gets a document on load if fetch prop is set to true', async () => {
    const { getByText, getByTestId, queryByText } = render(<MockDocument id={654321} fetch={true} />);

    expect(getByText('Loading')).toBeInTheDocument();

    await waitForElement(() => getByTestId('todo-item'));

    expect(getByTestId('todo-item')).toHaveTextContent('second todo');
    expect(queryByText('Loading')).not.toBeInTheDocument();
  });

  it('returns a descriptive message if no document exists', async () => {
    const { getByText, getByTestId, queryByText } = render(<MockDocument id={987654} fetch={true} />);

    expect(getByText('Loading')).toBeInTheDocument();

    await waitForElement(() => getByTestId('todo-item'));

    expect(getByTestId('todo-item')).toHaveTextContent('No such document.');
    expect(queryByText('Loading')).not.toBeInTheDocument();
  });

  it('returns an error if there is a problem getting a document', async () => {
    const { getByText } = render(<MockDocument error id={987654} fetch={true} onSuccess={mockOnSuccess} onError={mockOnError} />);

    await wait(() => {});

    const mockCalls = mockOnError.mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].action).toBe('get');
    expect(mockCalls[0][0].result).toContain('Error getting document');
  });

  it('listens for document snapshots if fetch and realtime props are set to true', async () => {
    const { getByTestId } = render(<MockDocument id={123456} fetch={true} realtime={true} />);

    expect(getByTestId('todo-item')).toHaveTextContent('first todo');
  });
});
