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
  name: 'firestore',
  collection: (collection) => ({
    add: () => (Promise.resolve(mockDocuments.docs[0])),
    get: () => (Promise.resolve(mockDocuments)),
    doc: (id) => ({
      delete: () => (Promise.resolve()),
      update: () => (Promise.resolve()),
      get: () => (Promise.resolve(mockDocuments.docs.find(doc => doc.id === id))),
      onSnapshot: (cb) => {
        cb(mockDocuments.docs.find(doc => doc.id === id))
        return () => {};
      }
    }),
    onSnapshot: (cb) => {
      cb(mockDocuments)
      return () => {};
    }
  })
};

export default mockFirestore;
