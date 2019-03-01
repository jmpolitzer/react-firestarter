import React from 'react';
import { cleanup, render, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

import mockFirestore from '../mocks/mockFirestore';
import MockCollection from '../mocks/mockCollection'

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
    const { getByTestId, queryByTestId } = render(<MockCollection />);

    expect(getByTestId('todos-container').children.length).toBe(2);
  });
});
