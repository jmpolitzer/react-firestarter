import firebase from 'firebase/app';

const fireInit = config => {
  firebase.initializeApp(firebaseConfig);
};

export { fireInit, firebase };
