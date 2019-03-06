import React from 'react';
import PropTypes from 'prop-types';

import { mockFirestore, mockFirestoreError } from './mockFirestore';
import { FirestoreProvider, Collection } from '../../index';

function MockCollection({ error, realtime, onError }) {
  return (
    <FirestoreProvider firestore={error ? mockFirestoreError : mockFirestore}>
      <Collection name='todos' realtime={realtime} onError={onError}>
        {({ isLoading, todos }) => {
          if (isLoading) {
            return <div data-testid='loading'>Loading</div>;
          } else {
            return (
              <div data-testid='todos-container'>
                {todos.map((todo, i) => (
                  <div key={i}>{todo.text}</div>
                ))}
              </div>
            );
          }
        }}
      </Collection>
    </FirestoreProvider>
  );
}

MockCollection.propTypes = {
  error: PropTypes.bool,
  realtime: PropTypes.bool,
  onError: PropTypes.func
};

export default MockCollection;
