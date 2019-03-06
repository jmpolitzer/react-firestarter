const mockNoCurrentUser = null;
const mockUnverifiedCurrentUser = {
  sendEmailVerification: () => Promise.resolve(),
  emailVerified: false
};
const mockVerifiedCurrentUser = {
  emailVerified: true,
  email: 'turd@ferguson.com'
};

const types = {
  none: mockNoCurrentUser,
  unverified: mockUnverifiedCurrentUser,
  verified: mockVerifiedCurrentUser,
  loggedIn: mockVerifiedCurrentUser
};

const mockFireauth = userType => {
  const currentUser = types[userType];

  return {
    createUserWithEmailAndPassword: () => Promise.resolve(),
    signInWithEmailAndPassword: () => Promise.resolve({ user: currentUser }),
    signOut: () => {},
    currentUser: currentUser,
    onAuthStateChanged: cb => {
      cb(userType === 'loggedIn' ? currentUser : null);
      return () => {};
    }
  };
};

const mockFireauthError = {
  createUserWithEmailAndPassword: () =>
    Promise.reject(new Error('We had trouble signing you up.')),
  signInWithEmailAndPassword: () =>
    Promise.reject(new Error('We had trouble logging you in.')),
  onAuthStateChanged: cb => {
    cb(null);
    return () => {};
  }
};

export { mockFireauth, mockFireauthError };
