import React from 'react';

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
  const { fireStore, children } = props;
  const db = fireStore;

  const add = async (collection, values) => {
    try {
      const docRef = await db.collection(collection).add(values);

      if (docRef) handleFireStoreMessage('success', `Document added with id: ${docRef.id}.`);
    } catch (error) {
      handleFireStoreMessage('error', `Error adding document: ${error}.`);
    }
  };

  const remove = async (collection, id) => {
    try {
      const docRef = db.collection(collection).doc(id);
      const deleted = docRef.delete();

      if (deleted) handleFireStoreMessage('success', 'Document successfully deleted.');
    } catch (error) {
      handleFireStoreMessage('error', `Error deleting document: ${error}.`);
    }
  };

  const update = async (collection, id, values) => {
    try {
      const docRef = db.collection(collection).doc(id);
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
      const docRef = db.collection(collection).doc(id);
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

  const getAll = async (collection) => {
    try {
      const querySnapshot = db.collection(collection).get();

      return querySnapshot.map(doc => doc.data());
    } catch (error) {
      handleFireStoreMessage('error', `Error getting documents: ${error}.`);
    }
  };

  const handleFireStoreMessage = (type, msg) => {
    console.log(type, msg);
  };

  return (
    <FirestoreContext.Provider
      value={{
        add: add,
        remove: remove,
        update: update,
        get: get,
        getAll: getAll
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

export { FirestoreContext, FirestoreProvider };
