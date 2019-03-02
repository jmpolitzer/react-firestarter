import React, { useState } from 'react';
import FirestoreContext from './context';

/*
  TODO:
  - Add option to enable offline data - https://cloud.google.com/firestore/docs/manage-data/enable-offline
  - Implement arrayUnion and arrayRemove for updating array values.
  - Add support for simple and compound queries.
  - Add support for ordering and limiting data.
  - Add support for pagination and query cursors.
*/

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

      handleCallback(onSuccess, 'delete', `Document ${id} successfully deleted.`);
    } catch (error) {
      handleCallback(onError, 'delete', `Error deleting document: ${error}.`);
    }
  };

  const update = async (collection, id, values, onSuccess, onError) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      docRef.update(values);

      handleCallback(onSuccess, 'update', `Document ${id} successfully updated.`);
    } catch (error) {
      handleCallback(onError, 'update', `Error updating document: ${error}.`);
    }
  };

  const get = async (collection, id, onSuccess, onError) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        handleCallback(onSuccess, 'get', doc.data());
      } else {
        handleCallback(onSuccess, 'get', 'No such document.')
      }
    } catch (error) {
      handleCallback(onError, 'get', `Error getting document: ${error}.`);
    }
  };

  const getAll = async (collection, onSuccess, onError) => {
    try {
      const querySnapshot = await db.collection(collection).get();

      const _collection = querySnapshot.docs.map(doc => {
        const data = doc.data();

        return { id: doc.id, ...data };
      });

      handleCallback(onSuccess, 'getAll', _collection);
    } catch (error) {
      handleCallback('error', `Error getting documents: ${error}.`);
    }
  };

  const handleCallback = (callback, action, result) => {
    setIsRequesting(false);

    if (callback) callback({ action, result });
  };

  const crud = { add, remove, update, get };

  return (
    <FirestoreContext.Provider
      value={{
        firestore,
        add,
        remove,
        update,
        get,
        getAll,
        isRequesting
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

export default FirestoreProvider;
