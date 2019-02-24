import React, { useEffect, useState } from 'react';

function Collection(props) {
  const { firestore, children, name } = props;
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
        const documents = querySnapshot.docs.map(doc => {
          const data = doc.data();

          return { id: doc.id, ...data };
        });

        setIsLoading(false);
        setDocuments(documents);
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
