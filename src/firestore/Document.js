import React from 'react';

function Document(props) {
  const {
    children,
    onSuccess,
    onError,
    id,
    name,
    add,
    remove,
    update,
    get,
    isRequesting
   } = props;

   const addDocument = values => {
     add(name, values, onSuccess, onError);
   }

   const removeDocument = () => {
     remove(name, id, onSuccess, onError);
   }

  return children({
    add: addDocument,
    remove: removeDocument,
    update,
    get,
    isRequesting
  });
};

export default Document;
