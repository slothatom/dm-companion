// =============================================
//   login.js - Auth page logic
// =============================================

let isSignUp = false;

// If already logged in, skip to home
(async function () {
  const { data: { session } } = await db.auth.getSession();
  if (session) window.location.href = 'home.html';
})();

function toggleMode(e) {
  if (e) e.preventDefault();
  isSignUp = !isSignUp;
  document.getElementById('auth-submit').textContent = isSignUp ? 'Create Account' : 'Sign In';
  document.getElementById('auth-toggle').innerHTML = isSignUp
    ? 'Already have an account? <a href="#" onclick="toggleMode(event)">Sign In</a>'
    : 'Don\'t have an account? <a href="#" onclick="toggleMode(event)">Sign Up</a>';
  document.getElementById('auth-error').textContent = '';
}

async function handleEmail(e) {
  e.preventDefault();
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errorEl  = document.getElementById('auth-error');
  const submitEl = document.getElementById('auth-submit');

  errorEl.textContent   = '';
  submitEl.textContent  = isSignUp ? 'Creating account…' : 'Signing in…';
  submitEl.disabled     = true;

  let result;
  if (isSignUp) {
    result = await db.auth.signUp({ email, password });
    if (!result.error) {
      errorEl.style.color = '#6aaa6a';
      errorEl.textContent = 'Account created! Check your email for a confirmation link.';
      submitEl.textContent = 'Create Account';
      submitEl.disabled    = false;
      return;
    }
  } else {
    result = await db.auth.signInWithPassword({ email, password });
    if (!result.error) { window.location.href = 'home.html'; return; }
  }

  errorEl.style.color  = '#c05050';
  errorEl.textContent  = result.error.message;
  submitEl.textContent = isSignUp ? 'Create Account' : 'Sign In';
  submitEl.disabled    = false;
}

async function signInWithGoogle() {
  const { error } = await db.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/home.html' }
  });
  if (error) document.getElementById('auth-error').textContent = error.message;
}

async function signInWithGitHub() {
  const { error } = await db.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin + '/home.html' }
  });
  if (error) document.getElementById('auth-error').textContent = error.message;
}

function showForgotPassword(e) {
  e.preventDefault();
  document.getElementById('auth-form').style.display      = 'none';
  document.getElementById('auth-toggle').style.display    = 'none';
  document.getElementById('forgot-section').style.display = 'block';
  document.getElementById('auth-error').textContent       = '';
  document.getElementById('auth-error').style.color       = '';
}

function showSignIn(e) {
  if (e) e.preventDefault();
  document.getElementById('auth-form').style.display            = 'block';
  document.getElementById('auth-toggle').style.display          = 'block';
  document.getElementById('forgot-section').style.display       = 'none';
  document.getElementById('new-password-section').style.display = 'none';
  document.getElementById('auth-error').textContent             = '';
}

async function sendPasswordReset() {
  const email   = (document.getElementById('reset-email').value || '').trim();
  const errorEl = document.getElementById('auth-error');
  if (!email) {
    errorEl.style.color = '#c05050';
    errorEl.textContent = 'Please enter your email address.';
    return;
  }
  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  if (error) {
    errorEl.style.color = '#c05050';
    errorEl.textContent = error.message;
  } else {
    errorEl.style.color = '#6aaa6a';
    errorEl.textContent = '✓ Reset link sent - check your email!';
  }
}

async function updatePassword() {
  const password = document.getElementById('new-password').value;
  const errorEl  = document.getElementById('auth-error');
  if (!password || password.length < 6) {
    errorEl.style.color = '#c05050';
    errorEl.textContent = 'Password must be at least 6 characters.';
    return;
  }
  const { error } = await db.auth.updateUser({ password });
  if (error) {
    errorEl.style.color = '#c05050';
    errorEl.textContent = error.message;
  } else {
    window.location.href = 'home.html';
  }
}

db.auth.onAuthStateChange(function (event) {
  if (event === 'PASSWORD_RECOVERY') {
    document.getElementById('auth-form').style.display            = 'none';
    document.getElementById('auth-toggle').style.display          = 'none';
    document.getElementById('forgot-section').style.display       = 'none';
    document.getElementById('new-password-section').style.display = 'block';
    document.getElementById('auth-error').textContent             = '';
  }
});
