import React from 'react';

const FirestoreContext = React.createContext();

function FirestoreProvider(props) {
  const { fireStore, children } = props;

  const add = async (collection, model) => {

  };

  const remove = async (collection, id) => {

  };

  const update = async (collection, id) => {

  };

  const get = async (collection, id) => {

  };

  const getAll = async (collection, queries) => {

  };

  return (
    <FirestoreContext.Provider
      value={{
        data: () => console.log("we're connected to firestore!", fireStore)
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}

export { FirestoreContext, FirestoreProvider };
