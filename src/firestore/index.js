import React, { useState } from 'react';

/*
  TODO:
  - Add hook to manage isRequesting state.
  - Add option to enable offline data - https://cloud.google.com/firestore/docs/manage-data/enable-offline
  - Implement arrayUnion and arrayRemove for updating array values.
  - Add realtime updates option.
  - Add support for simple and compound queries.
  - Add support for ordering and limiting data.
  - Add support for pagination and query cursors.
*/

const FirestoreContext = React.createContext();

function FirestoreProvider(props) {
  const { fireStore, children } = props;
  const [isRequesting, setIsRequesting] = useState(false);
  const db = fireStore;

  const add = async (collection, values, next) => {
    setIsRequesting(true);

    try {
      const docRef = await db.collection(collection).add(values);

      next(docRef.id);
      setIsRequesting(false);
    } catch (error) {
      handleFireStoreMessage('error', `Error adding document: ${error}.`, next);
    }
  };

  const remove = async (collection, id) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      const deleted = docRef.delete();

      if (deleted) handleFireStoreMessage('success', 'Document successfully deleted.');
    } catch (error) {
      handleFireStoreMessage('error', `Error deleting document: ${error}.`);
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

  return (
    <FirestoreContext.Provider
      value={{
        add: add,
        remove: remove,
        update: update,
        get: get,
        getAll: getAll,
        isRequesting
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

export { FirestoreContext, FirestoreProvider };
