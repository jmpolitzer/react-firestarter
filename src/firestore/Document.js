import React, { useContext, useEffect, useState } from 'react';
import FirestoreContext from './context';

function Document(props) {
  const {
    children,
    name,
    id,
    onSuccess,
    onError
   } = props;

   const { add, remove, update, get, isRequesting } = useContext(FirestoreContext);
   const [doc, setDocument] = useState(null);

   const addDocument = values => {
     add(name, values, onSuccess, onError);
   }

   const removeDocument = () => {
     remove(name, id, onSuccess, onError);
   }

   const updateDocument = values => {
     update(name, id, values, onSuccess, onError);
   }

   useEffect(() => {
     if (id) {
       get(name, id, ({ result: _doc }) => {
         setDocument(_doc);
       }, error => {
         console.log(error);
       });
     }
   },{});

  return children({
    add: addDocument,
    remove: removeDocument,
    update: updateDocument,
    doc: doc,
    isRequesting
  });
};

export default Document;
