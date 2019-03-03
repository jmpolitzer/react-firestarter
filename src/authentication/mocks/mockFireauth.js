const mockNoCurrentUser = null;
const mockUnverifiedCurrentUser = {
  sendEmailVerification: () => Promise.resolve(),
  emailVerified: false
};
const mockVerifiedCurrentUser = {
  emailVerified: true,
  email: 'turd@ferguson.com'
};

const mockFireauth = {
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  logout: () => {},
  currentUser: mockNoCurrentUser,
  onAuthStateChanged: cb => {
    cb(mockFireauth.currentUser);
    return () => {};
  }
};

const mockFireauthNoUser = { ...mockFireauth, currentUser: mockNoCurrentUser };
const mockFireauthUnverifiedUser = {
  ...mockFireauth,
  currentUser: mockUnverifiedCurrentUser
};
const mockFireauthVerifiedUser = {
  ...mockFireauth,
  currentUser: mockVerifiedCurrentUser
};

export {
  mockFireauthNoUser,
  mockFireauthUnverifiedUser,
  mockFireauthVerifiedUser
};
