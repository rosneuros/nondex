const urlInput = document.getElementById('urlInput');
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');
const reloadBtn = document.getElementById('reloadBtn');
const forwardBtn = document.getElementById('forwardBtn');
const goBtn = document.getElementById('goBtn');

// Sidebar elements
const sidebarUrlInput = document.getElementById('sidebarUrlInput');
const sidebarGoBtn = document.getElementById('sidebarGoBtn');
const mailBtn = document.getElementById('mailBtn');
const yandexBtn = document.getElementById('yandexBtn');
const googleBtn = document.getElementById('googleBtn');

homeBtn.addEventListener('click', () => window.electronAPI.navigate('home'));
backBtn.addEventListener('click', () => window.electronAPI.navigate('back'));
reloadBtn.addEventListener('click', () => window.electronAPI.navigate('reload'));
forwardBtn.addEventListener('click', () => window.electronAPI.navigate('forward'));
goBtn.addEventListener('click', () => {
  let url = urlInput.value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
  window.electronAPI.navigate('load', url);
});

urlInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') goBtn.click();
});

// Sidebar event listeners
sidebarGoBtn.addEventListener('click', () => {
  let url = sidebarUrlInput.value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
  window.electronAPI.navigate('load', url);
});

sidebarUrlInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') sidebarGoBtn.click();
});

mailBtn.addEventListener('click', () => window.electronAPI.navigate('load', 'https://mail.ru'));
yandexBtn.addEventListener('click', () => window.electronAPI.navigate('load', 'https://yandex.ru'));
googleBtn.addEventListener('click', () => window.electronAPI.navigate('load', 'https://google.com'));

window.electronAPI.onUrlUpdated((event, url) => {
  urlInput.value = url;
  sidebarUrlInput.value = url;  // Sync URL to sidebar input as well
});
