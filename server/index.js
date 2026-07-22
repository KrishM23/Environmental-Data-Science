/**
 * Local Terrain API server.
 * Run: npm start  (from /server)
 */
const { createApp } = require('./app');

const PORT = Number(process.env.PORT || 8787);
const app = createApp();

app.listen(PORT, () => {
  console.log(`Terrain API listening on http://localhost:${PORT}`);
  console.log('Endpoints: /api/auth/signup /api/auth/login /api/auth/me /api/progress');
});
