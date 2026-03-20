// =============================================
//   auth.js - Auth helpers for DM Companion
// =============================================

// Check if user is logged in; redirect to login.html if not.
// Returns the user object if authenticated, null otherwise.
async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session.user;
}

// Sign out and redirect to login
async function signOut() {
  await db.auth.signOut();
  window.location.href = 'login.html';
}
