// Anonymous message
async function sendMessage() {
  const textarea = document.getElementById('message-input');
  const btn = document.getElementById('send-btn');
  const status = document.getElementById('status');
  const message = textarea.value.trim();

  if (!message) {
    status.textContent = 'Please write a message first.';
    status.style.color = '#C04848';
    return;
  }
  if (message.length > 5000) {
    status.textContent = 'Message too long (max 5,000 characters).';
    status.style.color = '#C04848';
    return;
  }

  btn.disabled = true;
  status.textContent = '> sending message...';
  status.style.color = '#a0a0a0';

  try {
    const res = await fetch('https://anon-mailer.vercel.app/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (res.ok) {
      document.getElementById('anon-form').classList.add('hidden');
      document.getElementById('success-state').classList.remove('hidden');
    } else {
      const data = await res.json().catch(() => ({}));
      status.textContent = data.error || 'Something went wrong. Try again.';
      status.style.color = '#C04848';
      btn.disabled = false;
    }
  } catch (e) {
    status.textContent = 'Network error. Try again.';
    status.style.color = '#C04848';
    btn.disabled = false;
  }
}

// Command Palette
const overlay = document.getElementById('palette-overlay');
const paletteInput = document.getElementById('palette-input');
const paletteList = document.getElementById('palette-list');
let activeIndex = 0;

const commands = [
  { action: 'github', url: 'https://github.com/jecorona97' },
  { action: 'resume', url: '/assets/JoseEduardoCoronaEspinozaResume2026.pdf' },
  { action: 'linkedin', url: 'https://www.linkedin.com/in/coronaje/' },
  { action: 'message', fn: () => { document.getElementById('message-input').focus(); } },
  { action: 'contact', fn: () => { document.getElementById('message-input').focus(); } }
];

function openPalette() {
  overlay.classList.remove('hidden');
  paletteInput.value = '';
  filterCommands('');
  activeIndex = 0;
  updateActive();
  paletteInput.focus();
}

function closePalette() {
  overlay.classList.add('hidden');
}

function filterCommands(query) {
  const items = paletteList.querySelectorAll('li');
  const q = query.toLowerCase().replace(/^\//, '');
  items.forEach(item => {
    const match = item.dataset.action.includes(q);
    item.style.display = match ? '' : 'none';
  });
  activeIndex = 0;
  updateActive();
}

function getVisibleItems() {
  return [...paletteList.querySelectorAll('li')].filter(li => li.style.display !== 'none');
}

function updateActive() {
  const items = getVisibleItems();
  items.forEach((li, i) => li.classList.toggle('active', i === activeIndex));
}

function executeAction(action) {
  const cmd = commands.find(c => c.action === action);
  if (!cmd) return;
  closePalette();
  if (cmd.url) {
    window.open(cmd.url, '_blank', 'noopener');
  } else if (cmd.fn) {
    cmd.fn();
  }
}

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (overlay.classList.contains('hidden')) {
      openPalette();
    } else {
      closePalette();
    }
  }
  if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
    closePalette();
  }
});

paletteInput.addEventListener('input', () => {
  filterCommands(paletteInput.value);
});

paletteInput.addEventListener('keydown', (e) => {
  const items = getVisibleItems();
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % items.length;
    updateActive();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    updateActive();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const item = items[activeIndex];
    if (item) executeAction(item.dataset.action);
  }
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closePalette();
});

paletteList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) executeAction(li.dataset.action);
});
