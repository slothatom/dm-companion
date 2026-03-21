// =============================================
//   home.js - Dashboard / landing page
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  const name     = localStorage.getItem('dm-display-name-' + user.id) || user.user_metadata?.full_name || user.email || 'Adventurer';
  const greeting = getGreeting();
  document.getElementById('welcome-msg').textContent =
    greeting + ', ' + name.split(' ')[0] + '. Ready to run a great game?';
})();

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
