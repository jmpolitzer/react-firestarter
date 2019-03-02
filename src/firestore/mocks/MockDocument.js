import React, { Fragment } from 'react';

import mockFirestore from './mockFirestore';
import { FirestoreProvider, Document } from '../index';

function MockDocument({ onSuccess, onError }) {
  return (
    <FirestoreProvider firestore={mockFirestore}>
      <Document name="todos"
                onSuccess={onSuccess}
                onError={onError}>
        {({ add, remove, update, doc, isRequesting }) => (
          <Fragment>
            <button onClick={add}>Add</button>
            <button onClick={remove}>Remove</button>
            <button onClick={update}>Edit</button>
          </Fragment>
        )}
      </Document>
    </FirestoreProvider>
  )
}

export default MockDocument;
