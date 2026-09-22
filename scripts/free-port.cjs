/* Frees port 3000 (or $PORT) before the server starts, so a stale LockPhish
 * process can never block a fresh `npm start` (the classic EADDRINUSE trap
 * that leaves an outdated backend serving updated static files). */
const net = require('net');
const { execSync } = require('child_process');

const PORT = parseInt(process.env.PORT || '3000', 10);

function freeUnix() {
  const cmds = [
    `lsof -t -i :${PORT}`,
    `ss -tlnp 2>/dev/null | grep :${PORT} | grep -oP 'pid=\\K[0-9]+'`,
    `fuser ${PORT}/tcp 2>/dev/null`
  ];
  for (const cmd of cmds) {
    try {
      const out = execSync(cmd).toString().trim();
      const pids = [...new Set(out.split(/\s+/).filter(p => /^\d+$/.test(p)))];
      if (pids.length) {
        pids.forEach(pid => {
          try { execSync(`kill -9 ${pid}`); console.log(`[free-port] killed stale process pid ${pid}`); } catch (e) {}
        });
        return true;
      }
    } catch (e) { /* try next */ }
  }
  return false;
}

function freeWindows() {
  try {
    const out = execSync(`netstat -ano | findstr :${PORT} | findstr LISTENING`).toString();
    const pids = [...new Set(out.split('\n').map(l => l.trim().split(/\s+/).pop()).filter(p => /^\d+$/.test(p)))];
    pids.forEach(pid => {
      try { execSync(`taskkill /F /PID ${pid}`); console.log(`[free-port] killed stale process pid ${pid}`); } catch (e) {}
    });
    return pids.length > 0;
  } catch (e) {
    return false;
  }
}

const probe = net.createServer();
probe.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[free-port] port ${PORT} is busy — freeing it...`);
    const ok = process.platform === 'win32' ? freeWindows() : freeUnix();
    if (!ok) console.log('[free-port] could not free the port automatically. Stop the old LockPhish server manually (close its terminal or task-manager process), then run npm start again.');
  }
  probe.close(() => process.exit(0));
});
probe.once('listening', () => probe.close(() => process.exit(0)));
probe.listen(PORT);
