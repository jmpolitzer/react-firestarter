const mockDocuments = {
  docs: [
    {
      data: () => ({ text: 'first todo' }),
      id: 123456,
      exists: true
    },
    {
      data: () => ({ text: 'second todo' }),
      id: 654321,
      exists: true
    }
  ]
};

const mockFirestore = {
  collection: collection => ({
    add: () => Promise.resolve(mockDocuments.docs[0]),
    get: () => Promise.resolve(mockDocuments),
    doc: id => ({
      delete: () => Promise.resolve(),
      update: () => Promise.resolve(),
      get: () =>
        Promise.resolve(
          mockDocuments.docs.find(doc => doc.id === id) || { exists: false }
        ),
      onSnapshot: cb => {
        cb(mockDocuments.docs.find(doc => doc.id === id));
        return () => {};
      }
    }),
    onSnapshot: cb => {
      cb(mockDocuments);
      return () => {};
    }
  })
};

const error = new Error();
const mockFirestoreError = {
  collection: collection => ({
    add: () => Promise.reject(error),
    get: () => Promise.reject(error),
    doc: () => ({
      delete: () => Promise.reject(error),
      update: () => Promise.reject(error),
      get: () => Promise.reject(error)
    })
  })
};

export { mockFirestore, mockFirestoreError };
