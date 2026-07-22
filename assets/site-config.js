/* Terrain site config — edit publicOrigin after Netlify deploy if repo stays private */
window.TERRAIN = {
  github: 'KrishM23/Environmental-Data-Science',
  branch: 'main',
  /* e.g. 'https://your-site.netlify.app' — Colab can import notebooks from a public deploy URL */
  publicOrigin: '',
  /*
   * API base for auth + progress.
   * Leave empty in production (same-origin /api via Netlify Functions).
   * Local: run `npm start` in /server (port 8787); auth.js falls back automatically.
   * Override only if the API is hosted elsewhere.
   */
  apiBase: ''
};
