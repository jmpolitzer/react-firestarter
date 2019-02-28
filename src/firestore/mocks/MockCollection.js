import React from 'react';

import mockFirestore from './mockFirestore';
import FirestoreProvider from '../Provider';
import Collection from '../Collection';

function MockCollection({ realtime = true }) {
  return (
    <FirestoreProvider firestore={mockFirestore}>
      <div data-testid="todos-container">
        <Collection name="todos" realtime={realtime}>
          {({ isLoading, todos }) => {
            if (isLoading) {
              return <div data-testid="loading">Loading</div>;
            } else {
              return (
                todos.map((todo, i) => (
                  <div key={i}>{todo.text}</div>
                ))
              )
            }
          }}
        </Collection>
      </div>
    </FirestoreProvider>
  );
}

export default MockCollection;
