import React from 'react';

function Document(props) {
  const {
    children,
    onSuccess,
    onError,
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

  return children({
    add: addDocument,
    remove,
    update,
    get,
    isRequesting
  });
};

export default Document;
