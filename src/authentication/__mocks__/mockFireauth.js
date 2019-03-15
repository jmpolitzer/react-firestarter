const mockNoCurrentUser = null;
const mockUnverifiedCurrentUser = {
  sendEmailVerification: () => Promise.resolve(),
  emailVerified: false,
  uid: 123456
};
const mockUnverifiedCurrentUserError = {
  sendEmailVerification: () =>
    Promise.reject(
      new Error(
        'There was a problem sending your email verification. Please try again.'
      )
    ),
  emailVerified: false
};
const mockVerifiedCurrentUser = {
  emailVerified: true,
  email: 'turd@ferguson.com',
  user: {
    uid: 123456
  }
};

const types = {
  none: mockNoCurrentUser,
  unverified: mockUnverifiedCurrentUser,
  unverifiedError: mockUnverifiedCurrentUserError,
  verified: mockVerifiedCurrentUser,
  loggedIn: mockVerifiedCurrentUser
};

const mockFireauth = userType => {
  const currentUser = types[userType];

  return {
    createUserWithEmailAndPassword: () => Promise.resolve(currentUser),
    signInWithEmailAndPassword: () => Promise.resolve({ user: currentUser }),
    signOut: () => {},
    currentUser: currentUser,
    sendPasswordResetEmail: () => Promise.resolve(),
    onAuthStateChanged: cb => {
      cb(userType === 'loggedIn' ? currentUser : null);
      return () => {};
    },
    app: {
      firebase_: {
        firestore: {
          collection: collection => ({
            doc: id => ({
              set: user => Promise.resolve({ id: id, ...user }),
              get: id =>
                Promise.resolve({
                  id: id,
                  name: 'Turd Ferguson',
                  ...currentUser
                })
            })
          })
        }
      }
    }
  };
};

const mockFireauthError = {
  createUserWithEmailAndPassword: () =>
    Promise.reject(new Error('We had trouble signing you up.')),
  signInWithEmailAndPassword: () =>
    Promise.reject(new Error('We had trouble logging you in.')),
  sendPasswordResetEmail: () =>
    Promise.reject(new Error('We had trouble sending a password reset email.')),
  onAuthStateChanged: cb => {
    cb(null);
    return () => {};
  },
  app: {
    firebase_: {
      firestore: {}
    }
  }
};

export { mockFireauth, mockFireauthError };
