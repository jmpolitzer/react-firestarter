import React from 'react';

import { mockFirestore, mockFirestoreError } from './mockFirestore';
import { FirestoreProvider, Collection } from '../index';

function MockCollection({ error, realtime, onError }) {
  return (
    <FirestoreProvider firestore={error ? mockFirestoreError : mockFirestore}>
      <Collection name="todos" realtime={realtime} onError={onError}>
        {({ isLoading, todos }) => {
          if (isLoading) {
            return <div data-testid="loading">Loading</div>;
          } else {
            return (
              <div data-testid="todos-container">
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

export default MockCollection;
