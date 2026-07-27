const { spawn } = require('child_process');

console.log('Starting NGO Backend API Server on port 5000...');
const api = spawn('node', ['api/index.js'], { stdio: 'inherit', shell: true });

console.log('Starting Vite Frontend Dev Server...');
const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  if (api) api.kill('SIGINT');
  if (vite) vite.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  if (api) api.kill('SIGTERM');
  if (vite) vite.kill('SIGTERM');
  process.exit();
});
