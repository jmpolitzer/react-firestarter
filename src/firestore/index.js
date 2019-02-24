import React, { useState } from 'react';

import Collection from './Collection';
import Document from './Document';

/*
  TODO:
  - Add option to enable offline data - https://cloud.google.com/firestore/docs/manage-data/enable-offline
  - Implement arrayUnion and arrayRemove for updating array values.
  - Add realtime updates option.
  - Add support for simple and compound queries.
  - Add support for ordering and limiting data.
  - Add support for pagination and query cursors.
*/

const FirestoreContext = React.createContext();

function FirestoreProvider(props) {
  const { firestore, children } = props;
  const [isRequesting, setIsRequesting] = useState(false);
  const db = firestore;

  const add = async (collection, values, onSuccess, onError) => {
    setIsRequesting(true);

    try {
      const docRef = await db.collection(collection).add(values);

      handleCallback(onSuccess, 'add', docRef.id);
    } catch (error) {
      handleCallback(onError, 'add', `Error adding document: ${error}.`);
    }
  };

  const remove = async (collection, id, onSuccess, onError) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      docRef.delete();

      handleCallback(onSuccess, 'delete', 'Document successfully deleted.');
    } catch (error) {
      handleCallback(onError, 'delete', `Error deleting document: ${error}.`);
    }
  };

  const update = async (collection, id, values) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      const updated = docRef.update({
        ...values,
        updatedAt: db.FieldValue.serverTimestamp()
      });

      if (updated) handleFireStoreMessage('success', 'Document successfully updated.');
    } catch (error) {
      handleFireStoreMessage('error', `Error updating document: ${error}.`);
    }
  };

  const get = async (collection, id) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      const doc = docRef.get();

      if (doc.exists) {
        return doc.data();
      } else {
        handleFireStoreMessage('success', 'No such document.')
      }
    } catch (error) {
      handleFireStoreMessage('error', `Error getting document: ${error}.`);
    }
  };

  const getAll = async (collection, next) => {
    try {
      const querySnapshot = await db.collection(collection).get();

      next(querySnapshot.docs.map(doc => {
        const data = doc.data();

        return { id: doc.id, ...data };
      }));
    } catch (error) {
      handleFireStoreMessage('error', `Error getting documents: ${error}.`, next);
    }
  };

  const handleFireStoreMessage = (type, message, next) => {
    setIsRequesting(false);

    if (next) next({ type, message });
  };

  const handleCallback = (callback, action, result) => {
    setIsRequesting(false);

    if (callback) callback({ action, result });
  };

  const crud = { add, remove, update, get };

  return (
    <FirestoreContext.Provider
      value={{
        Collection: (props) => <Collection {...props} firestore={firestore} />,
        Document: (props) => <Document {...props} {...crud} isRequesting={isRequesting} />
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

export { FirestoreContext, FirestoreProvider };
