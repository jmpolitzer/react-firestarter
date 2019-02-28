import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import FirestoreContext from '../context';
import FirestoreProvider from '../Provider';

afterEach(cleanup);

describe('FirestoreProvider', () => {
  it('receives a firestore prop and passes it to the consumer', () => {
    const tree = (
      <FirestoreProvider firestore={'wutzup'}>
        <FirestoreContext.Consumer>
          {value => <span>Received: {value.firestore}</span>}
        </FirestoreContext.Consumer>
      </FirestoreProvider>
    );

    const { getByText } = render(tree);

    expect(getByText(/^Received:/)).toHaveTextContent('Received: wutzup');
  });
});
