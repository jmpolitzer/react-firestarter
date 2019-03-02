import React, { useContext, useEffect, useState } from 'react';
import FirestoreContext from './context';

function Document(props) {
  const {
    children,
    name,
    id,
    onSuccess,
    onError,
    realtime = false,
    fetch = false
  } = props;

  const { firestore, add, remove, update, get } = useContext(FirestoreContext);
  const [doc, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const db = firestore;

  const addDocument = values => {
    add(name, values, onSuccess, onError);
  };

  const removeDocument = () => {
    remove(name, id, onSuccess, onError);
  };

  const updateDocument = values => {
    update(name, id, values, onSuccess, onError);
  };

  useEffect(() => {
    if (id && fetch) {
      setIsLoading(true);

      if (realtime) {
        const unsubscribe = db
          .collection(name)
          .doc(id)
          .onSnapshot(doc => {
            const _doc = doc.data();

            setIsLoading(false);
            setDocument(_doc);
          });

        return function cleanup() {
          unsubscribe();
        };
      } else {
        get(
          name,
          id,
          ({ result: _doc }) => {
            setIsLoading(false);
            setDocument(_doc);
          },
          error => {
            onError(error);
          }
        );
      }
    }
  }, []);

  return children({
    add: addDocument,
    remove: removeDocument,
    update: updateDocument,
    doc: doc,
    isLoading
  });
}

export default Document;
