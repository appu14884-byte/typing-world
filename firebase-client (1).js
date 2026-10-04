/* Firebase compat adapter for Typing World.
 * Requires firebase-config.js and the Firebase compat SDK scripts.
 * Never add service-account credentials or private OAuth secrets here.
 */
(() => {
  const config = window.TYPING_WORLD_FIREBASE || {};
  const requiredConfig = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId'
  ];
  const configIsComplete = requiredConfig.every((key) => Boolean(config[key]));

  const unavailableMessage = 'Firebase is not configured. Check firebase-config.js and load the Firebase SDK scripts.';
  const showUnavailable = (message = unavailableMessage) => {
    window.TypingWorldAuth = {
      isConfigured: false,
      configurationMessage: message
    };
  };

  if (!window.firebase) {
    showUnavailable('Firebase SDK did not load. Check the Firebase SDK script tags.');
    return;
  }

  if (!configIsComplete) {
    showUnavailable();
    return;
  }

  let app;
  let auth;
  let db;
  let googleProvider;

  try {
    app = window.firebase.apps?.length ?
      window.firebase.app() :
      window.firebase.initializeApp(config);
    auth = window.firebase.auth(app);
    db = window.firebase.firestore(app);
    googleProvider = new window.firebase.auth.GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Firebase initialization failed.', error);
    showUnavailable('Firebase could not initialize. Check the Firebase configuration and enabled services.');
    return;
  }

  const friendlyError = (error) => {
    const messages = {
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account was found for that email.',
      'auth/wrong-password': 'The email or password is incorrect.',
      'auth/invalid-credential': 'The email or password is incorrect.',
      'auth/email-already-in-use': 'An account already exists for that email. Try logging in.',
      'auth/weak-password': 'Choose a stronger password and try again.',
      'auth/popup-closed-by-user': 'The Google sign-in window was closed before completing sign-in.',
      'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups and try again.',
      'auth/unauthorized-domain': 'This site is not authorized for Firebase sign-in yet.',
      'permission-denied': 'Your profile could not be saved. Check the Firestore security rules.',
      'firestore/permission-denied': 'Your profile could not be saved. Check the Firestore security rules.',
      'auth/operation-not-allowed': 'This sign-in method is disabled in Firebase Authentication.',
      'auth/operation-not-supported-in-this-environment': 'Google sign-in requires a supported HTTP or HTTPS page and browser storage. The in-editor preview may not support Firebase Authentication; open the site from its published web address and enable browser storage.',
      'auth/network-request-failed': 'Could not reach Firebase. Check your connection and try again.',
      'auth/unauthorized-domain': 'This website domain is not authorized for Firebase sign-in.',
      'auth/account-exists-with-different-credential': 'An account already exists with another sign-in method. Try logging in with that method.'
    };

    return new Error(messages[error?.code] || error?.message || 'Authentication failed. Please try again.');
  };

  const getCurrentUser = () => auth.currentUser;

  const onAuthStateChanged = (callback) => auth.onAuthStateChanged(callback);

  const saveUserProfile = async (uid, data = {}) => {
    if (!uid) throw new Error('A signed-in user is required to save a profile.');
    if (auth.currentUser?.uid !== uid) {
      throw new Error('You can only save your own profile.');
    }

    const profile = {
      username: String(data.username || auth.currentUser.displayName || 'Typing Explorer').trim().slice(0, 24),
      email: auth.currentUser.email || null,
      avatarUrl: data.avatarUrl || auth.currentUser.photoURL || null,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await db.collection('users').doc(uid).set(profile, {
        merge: true
      });
    } catch (error) {
      throw friendlyError(error);
    }
  };

  const getUserProfile = async (uid) => {
    if (!uid) throw new Error('A signed-in user is required to load a profile.');
    if (auth.currentUser?.uid !== uid) {
      throw new Error('You can only read your own profile.');
    }

    try {
      const snapshot = await db.collection('users').doc(uid).get();
      return snapshot.exists ? snapshot.data() : null;
    } catch (error) {
      throw friendlyError(error);
    }
  };

  const syncSignedInProfile = async (user, requestedUsername = '') => {
    if (!user) return null;

    const existing = await getUserProfile(user.uid);
    const username = requestedUsername || existing?.username || user.displayName || 'Typing Explorer';

    await saveUserProfile(user.uid, {
      username,
      avatarUrl: user.photoURL || existing?.avatarUrl || null
    });

    return getUserProfile(user.uid);
  };

  // Profile sync is useful, but it must not turn a successful Firebase sign-in
  // into a reported authentication failure when Firestore is unavailable.
  const syncSignedInProfileSafely = async (user, requestedUsername = '') => {
    try {
      return await syncSignedInProfile(user, requestedUsername);
    } catch (error) {
      console.warn('Signed in successfully, but the Firestore profile could not be synchronized.', error?.code || error?.message || 'Unknown Firestore error');
      return null;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!['http:', 'https:', 'chrome-extension:'].includes(window.location.protocol)) {
        const error = new Error('Google sign-in requires a supported HTTP or HTTPS page. Open the site from its published web address to continue.');
        error.code = 'auth/operation-not-supported-in-this-environment';
        throw error;
      }

      try {
        const storageTestKey = '__typing_world_storage_check__';
        window.localStorage.setItem(storageTestKey, '1');
        window.localStorage.removeItem(storageTestKey);
      } catch {
        const error = new Error('Google sign-in requires browser storage. Enable site storage and try again.');
        error.code = 'auth/operation-not-supported-in-this-environment';
        throw error;
      }

      const result = await auth.signInWithPopup(googleProvider);
      await syncSignedInProfileSafely(result.user);
      return result.user;
    } catch (error) {
      throw friendlyError(error);
    }
  };

  const signUp = async (email, password, username = '') => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      if (username.trim()) {
        await result.user.updateProfile({
          displayName: username.trim().slice(0, 24)
        });
      }
      await syncSignedInProfileSafely(result.user, username);
      return result.user;
    } catch (error) {
      throw friendlyError(error);
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      await syncSignedInProfileSafely(result.user);
      return result.user;
    } catch (error) {
      throw friendlyError(error);
    }
  };

  const resetPassword = async (email) => {
    try {
      return await auth.sendPasswordResetEmail(email);
    } catch (error) {
      throw friendlyError(error);
    }
  };

  const signOut = async () => {
    try {
      return await auth.signOut();
    } catch (error) {
      throw friendlyError(error);
    }
  };

  // Client-submitted scores are untrusted. Keep this method explicit and
  // disabled until a trusted server-side score validation flow is implemented.
  const saveTypingResult = async () => {
    throw new Error('Typing result saving is unavailable until trusted server-side score validation is configured.');
  };

  window.TypingWorldAuth = {
    isConfigured: true,
    auth,
    db,
    app,
    googleProvider,
    signInWithGoogle,
    googleSignIn: signInWithGoogle,
    signInGoogle: signInWithGoogle,
    signUp,
    signIn,
    resetPassword,
    signOut,
    getCurrentUser,
    onAuthStateChanged,
    saveUserProfile,
    getUserProfile,
    saveTypingResult,
    configurationMessage: 'Firebase is configured.'
  };

  console.info('TypingWorldAuth is ready.');
})();
