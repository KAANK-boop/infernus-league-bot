const API_URL = 'http://localhost:3005';

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}g ${h}s`;
  if (h > 0) return `${h}s ${m}d`;
  return `${m}d ${s}s`;
}

async function fetchStatus() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const ping = document.getElementById('statusPing');

  try {
    const res = await fetch(`${API_URL}/status`);
    const data = await res.json();

    if (data.status === 'online') {
      dot.className = 'status-indicator online';
      text.textContent = 'Çevrimiçi';
      text.style.color = '#22c55e';
      ping.textContent = `${data.ping}ms`;
      document.getElementById('statGuilds').textContent = data.guildCount;
      document.getElementById('statMembers').textContent = data.memberCount.toLocaleString();
      document.getElementById('statCommands').textContent = data.commands || '—';
      document.getElementById('statUptime').textContent = formatUptime(data.uptime);
    } else {
      dot.className = 'status-indicator offline';
      text.textContent = 'Çevrimdışı';
      text.style.color = '#ef4444';
    }
  } catch {
    dot.className = 'status-indicator offline';
    text.textContent = 'Çevrimdışı';
    text.style.color = '#ef4444';
    ping.textContent = '—';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchStatus();
  setInterval(fetchStatus, 15000);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
