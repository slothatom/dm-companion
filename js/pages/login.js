// =============================================
//   login.js - Auth page logic (OAuth only)
// =============================================

// If already logged in, skip to home
(async function () {
  const { data: { session } } = await db.auth.getSession();
  if (session) window.location.href = 'home.html';
})();

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
