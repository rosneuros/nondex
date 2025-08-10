const urlInput = document.getElementById('urlInput');
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');
const reloadBtn = document.getElementById('reloadBtn');
const forwardBtn = document.getElementById('forwardBtn');
const goBtn = document.getElementById('goBtn');

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

window.electronAPI.onUrlUpdated((event, url) => {
  urlInput.value = url;
});
