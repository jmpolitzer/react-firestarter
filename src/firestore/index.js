import React from 'react';

const FirestoreContext = React.createContext();

function FirestoreProvider(props) {
  const { fireStore, children } = props;

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
