import React, { useContext, useEffect, useState } from 'react';
import FirestoreContext from './context';

function Collection(props) {
  const {
    children,
    name,
    realtime = true
  } = props;

  const { firestore, getAll } = useContext(FirestoreContext);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = firestore;

  useEffect(() => {
    /* TODO: Handle Queries. */
    if (realtime) {
      /* Question: Is it useful to check for type of update - added, updated, removed? */
      const unsubscribe = db.collection(name)
      .onSnapshot(querySnapshot => {
        console.log('realtime update');
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
    } else {
      getAll(name, ({ result: _documents }) => {
        setIsLoading(false);
        setDocuments(_documents);
      }, error => {
        console.log(error);
      });
    }
  }, []);

  return children({
    isLoading,
    [name]: documents
  });
};

export default Collection;
