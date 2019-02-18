import React from 'react';

const FirestoreContext = React.createContext();

function FirestoreProvider(props) {
  const { fireStore, children } = props;

  const add = (collection, model) = {

  };

  const delete = (collection, id) = {

  }

  const update = (collection, id) = {

  }

  const get = (collection, id) = {

  }

  const getAll = (collection, queries) = {
    
  }

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
