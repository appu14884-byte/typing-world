(() => {
  const messageNode = document.getElementById('authMessage');
  const submitButton = document.getElementById('authSubmit');
  const authForm = document.querySelector('[data-auth-form]');
  const pageType = document.body.dataset.authPage;
  const provider = () => window.TypingWorldAuth;

  const showMessage = (message, success = false) => {
    if (!messageNode) return;
    messageNode.textContent = message;
    messageNode.classList.toggle('success', success);
  };

  const friendlyError = (error) => {
    const messages = {
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/popup-blocked': 'Please allow pop-ups for this website, then try again.',
      'auth/unauthorized-domain': 'This site domain is not authorized for sign-in yet.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account was found for that email.',
      'auth/wrong-password': 'The email or password is incorrect.',
      'auth/invalid-credential': 'The email or password is incorrect.',
      'auth/email-already-in-use': 'An account already exists for that email. Try logging in.',
      'auth/weak-password': 'Choose a stronger password and try again.'
    };
    return messages[error?.code] || error?.message || 'Something went wrong. Please try again.';
  };

  const runButtonAction = async (button, action, pendingText) => {
    if (!button) return;
    const originalText = button.textContent;
    button.disabled = true;
    if (pendingText) button.textContent = pendingText;
    showMessage('');

    try {
      await action();
    } catch (error) {
      if (error?.code !== 'auth/operation-not-supported-in-this-environment') {
        console.error('Authentication action failed:', error);
      }
      showMessage(friendlyError(error));
      button.disabled = false;
      button.textContent = originalText;
    }
  };

  const auth = provider();
  const googleButtons = [
    document.getElementById('loginBtn'),
    document.getElementById('googleAuth')
  ].filter(Boolean);

  googleButtons.forEach((button) => {
    const isReady = Boolean(auth?.isConfigured && typeof auth.signInWithGoogle === 'function');
    button.disabled = !isReady;

    if (!isReady) {
      button.title = auth?.configurationMessage || 'Authentication is not configured.';
      return;
    }

    button.addEventListener('click', () => runButtonAction(
      button,
      async () => {
          showMessage('Opening Google sign-in...');
          await auth.signInWithGoogle();
          showMessage('Login successful. Redirecting…', true);
          window.location.assign('/');
        },
        'Connecting…'
    ));
  });

  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(reveal));
      button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    });
  });

  if (!authForm) return;

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const backend = provider();
    if (!backend?.isConfigured) {
      showMessage(backend?.configurationMessage || 'Authentication is not configured.');
      return;
    }

    const formData = new FormData(authForm);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const username = String(formData.get('username') || '').trim();
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (pageType === 'signup') {
      if (username.length < 2 || username.length > 24) {
        showMessage('Username must be between 2 and 24 characters.');
        return;
      }
      if (password !== confirmPassword) {
        showMessage('Your passwords do not match.');
        return;
      }
    }

    const action = async () => {
      if (pageType === 'login') {
        await backend.signIn(email, password);
        showMessage('Login successful. Redirecting…', true);
        window.location.assign('/');
      } else if (pageType === 'signup') {
        await backend.signUp(email, password, username);
        showMessage('Account created. Redirecting…', true);
        window.location.assign('/');
      } else if (pageType === 'forgot') {
        await backend.resetPassword(email);
        showMessage('If an account exists for that email, password reset instructions have been sent.', true);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send reset instructions →';
        }
      }
    };

    await runButtonAction(submitButton, action, 'Please wait…');
  });
})();
