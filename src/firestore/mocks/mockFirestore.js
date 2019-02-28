const mockDocuments = {
  docs: [
    {
      data: () => ({ text: 'first todo' }),
      id: 1
    },
    {
      data: () => ({ text: 'second todo' }),
      id: 2
    }
  ]
};

const mockFirestore = {
  name: 'firestore',
  collection: (collection) => ({
    add: (values) => (Promise.resolve(values)),
    get: () => (Promise.resolve(mockDocuments))
  })
};

export default mockFirestore;
