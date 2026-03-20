// =============================================
//   maps.js - Maps page (placeholder)
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);

  document.getElementById('maps-area').innerHTML =
    '<div class="card" style="text-align:center; padding:40px 20px;">' +
      '<i class="fi fi-rr-map" style="font-size:48px; color:var(--text-dim); display:block; margin-bottom:16px;"></i>' +
      '<h3 style="margin-bottom:8px;">Maps & Battle Grids</h3>' +
      '<p style="color:var(--text-muted);">Upload and annotate battle maps, draw grids, and add tokens. Coming soon!</p>' +
    '</div>';
})();
