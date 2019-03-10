import React from 'react';
import PropTypes from 'prop-types';
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
  const db = firestore;

  const add = async (collection, values, context, onSuccess, onError) => {
    try {
      const docRef = await db.collection(collection).add(values);

      handleCallback(onSuccess, 'add', docRef.id, context);
    } catch (error) {
      handleCallback(
        onError,
        'add',
        `Error adding document: ${error}.`,
        context
      );
    }
  };

  const remove = async (collection, id, context, onSuccess, onError) => {
    try {
      await db
        .collection(collection)
        .doc(id)
        .delete();

      handleCallback(
        onSuccess,
        'delete',
        `Document ${id} successfully deleted.`,
        context
      );
    } catch (error) {
      handleCallback(
        onError,
        'delete',
        `Error deleting document: ${error}.`,
        context
      );
    }
  };

  const update = async (
    collection,
    id,
    values,
    context,
    onSuccess,
    onError
  ) => {
    try {
      await db
        .collection(collection)
        .doc(id)
        .update(values);

      handleCallback(
        onSuccess,
        'update',
        `Document ${id} successfully updated.`,
        context
      );
    } catch (error) {
      handleCallback(
        onError,
        'update',
        `Error updating document: ${error}.`,
        context
      );
    }
  };

  const get = async (collection, id, onSuccess, onError) => {
    try {
      const docRef = await db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        handleCallback(onSuccess, 'get', doc.data());
      } else {
        handleCallback(onSuccess, 'get', 'No such document.');
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
      handleCallback(onError, 'getAll', `Error getting documents: ${error}.`);
    }
  };

  const handleCallback = (next, action, result, context) => {
    if (next) next({ action, result, context });
  };

  return (
    <FirestoreContext.Provider
      value={{
        firestore,
        add,
        remove,
        update,
        get,
        getAll
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

FirestoreProvider.propTypes = {
  firestore: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]).isRequired
};

export default FirestoreProvider;
