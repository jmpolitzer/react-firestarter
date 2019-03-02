import React, { Fragment } from 'react';

import { mockFirestore, mockFirestoreError } from './mockFirestore';
import { FirestoreProvider, Document } from '../index';

function MockDocument({ id, fetch, realtime, onSuccess, onError, error }) {
  return (
    <FirestoreProvider firestore={error ? mockFirestoreError : mockFirestore}>
      <Document name="todos"
                id={id}
                fetch={fetch}
                realtime={realtime}
                onSuccess={onSuccess}
                onError={onError}>
        {({ add, remove, update, doc, isLoading }) => {
          if (isLoading) {
            return <div>Loading</div>;
          } else {
            if (doc) {
              return <div data-testid="todo-item">{typeof doc === 'string' ? doc : doc.text}</div>;
            } else {
              return (
                <Fragment>
                  <button onClick={add}>Add</button>
                  <button onClick={remove}>Remove</button>
                  <button onClick={update}>Update</button>
                </Fragment>
              );
            }
          }
        }}
      </Document>
    </FirestoreProvider>
  )
}

export default MockDocument;
