import React, { useContext, useEffect, useState } from 'react';
import FirestoreContext from './context';

function Collection(props) {
  const { children, name } = props;
  const { firestore } = useContext(FirestoreContext);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = firestore;

  useEffect(() => {
    /* TODO:
      - Handle Queries
      - Check for type of update - added, updated, removed.
    */
    const unsubscribe = db.collection(name)
      .onSnapshot(querySnapshot => {
        const _documents = querySnapshot.docs.map(doc => {
          const data = doc.data();

          return { id: doc.id, ...data };
        });

        setIsLoading(false);
        setDocuments(_documents);
      });

    return function cleanup() {
      unsubscribe();
    }
  }, []);

  return children({
    isLoading,
    [name]: documents
  });
};

export default Collection;
