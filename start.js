const { spawn } = require('child_process');

function startBot() {
  const proc = spawn('node', ['index.js'], {
    stdio: 'inherit',
    cwd: __dirname,
    detached: true,
  });
  proc.unref();

  proc.on('exit', (code) => {
    console.log(`Bot çıktı (kod: ${code}). 3 saniye sonra yeniden başlatılıyor...`);
    setTimeout(startBot, 3000);
  });

  proc.on('error', (err) => {
    console.error('Bot başlatılamadı:', err.message);
    setTimeout(startBot, 5000);
  });
}

startBot();
