import React from 'react';

import mockFirestore from './mockFirestore';
import { FirestoreProvider, Collection } from '../index';

function MockCollection({ realtime }) {
  return (
    <FirestoreProvider firestore={mockFirestore}>
      <Collection name="todos" realtime={realtime}>
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
            )
          }
        }}
      </Collection>
    </FirestoreProvider>
  );
}

export default MockCollection;
