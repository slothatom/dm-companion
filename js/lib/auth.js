// =============================================
//   auth.js - Auth helpers for DM Companion
// =============================================

// Check if user is logged in; redirect to login.html if not.
// Returns the user object if authenticated, null otherwise.
// Uses onAuthStateChange to avoid false redirects during token refresh.
async function requireAuth() {
  // First try getSession (fast, from memory/storage)
  var result = await db.auth.getSession();
  if (result.data.session) {
    return result.data.session.user;
  }

  // Session might be null during a token refresh — wait briefly
  // for the auth state to settle before redirecting.
  return new Promise(function (resolve) {
    var timeout = setTimeout(function () {
      unsub();
      window.location.href = 'login.html';
      resolve(null);
    }, 3000);

    var unsub = db.auth.onAuthStateChange(function (event, session) {
      if (session) {
        clearTimeout(timeout);
        unsub();
        resolve(session.user);
      } else if (event === 'SIGNED_OUT') {
        clearTimeout(timeout);
        unsub();
        window.location.href = 'login.html';
        resolve(null);
      }
    });

    // onAuthStateChange returns { data: { subscription } }
    if (unsub && unsub.data && unsub.data.subscription) {
      var sub = unsub.data.subscription;
      unsub = function () { sub.unsubscribe(); };
    }
  });
}

// Sign out and redirect to login
async function signOut() {
  await db.auth.signOut();
  window.location.href = 'login.html';
}
