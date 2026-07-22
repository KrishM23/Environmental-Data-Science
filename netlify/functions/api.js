/**
 * Netlify Functions entry for Terrain API.
 * Redirect /api/* → this function (see netlify.toml).
 */
const path = require('path');
const { createApp } = require('../../server/app');
const serverless = require('serverless-http');

/* Persist auth store in /tmp on Lambda (writable); local uses server/data */
if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  process.env.TERRAIN_STORE_PATH =
    process.env.TERRAIN_STORE_PATH || path.join('/tmp', 'terrain-store.json');
}

const app = createApp();
const handle = serverless(app);

exports.handler = async (event, context) => {
  let p = event.path || event.rawPath || '';
  // Normalize so Express sees /api/...
  if (p.startsWith('/.netlify/functions/api')) {
    const rest = p.slice('/.netlify/functions/api'.length) || '/';
    p = rest.startsWith('/api') ? rest : '/api' + (rest === '/' ? '/health' : rest);
  }
  event.path = p;
  if (event.rawPath) event.rawPath = p;
  return handle(event, context);
};
