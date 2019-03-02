import { useContext, useEffect, useState } from 'react';
import FirestoreContext from './context';

function Collection(props) {
  const { children, name, onError, realtime = true } = props;

  const { firestore, getAll } = useContext(FirestoreContext);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const db = firestore;

  useEffect(() => {
    setIsLoading(true);
    /* TODO: Handle Queries. */
    if (realtime) {
      /* Question: Is it useful to check for type of update - added, updated, removed? */
      const unsubscribe = db.collection(name).onSnapshot(querySnapshot => {
        const _documents = querySnapshot.docs.map(doc => {
          const data = doc.data();

          return { id: doc.id, ...data };
        });

        setIsLoading(false);
        setDocuments(_documents);
      });

      return function cleanup() {
        unsubscribe();
      };
    } else {
      getAll(
        name,
        ({ result: _documents }) => {
          setIsLoading(false);
          setDocuments(_documents);
        },
        error => {
          onError(error);
        }
      );
    }
  }, []);

  return children({
    isLoading,
    [name]: documents
  });
}

export default Collection;
