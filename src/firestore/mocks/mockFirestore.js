const mockDocuments = {
  docs: [
    {
      data: () => ({ text: 'first todo' }),
      id: 123456
    },
    {
      data: () => ({ text: 'second todo' }),
      id: 654321
    }
  ]
};

const mockFirestore = {
  name: 'firestore',
  collection: (collection) => ({
    add: () => (Promise.resolve(mockDocuments.docs[0])),
    get: () => (Promise.resolve(mockDocuments)),
    onSnapshot: (cb) => {
      cb(mockDocuments)
      return () => {};
    }
  })
};

export default mockFirestore;
