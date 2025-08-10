const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  navigate: (action, url) => ipcRenderer.send('navigate', { action, url }),
  onUrlUpdated: (callback) => ipcRenderer.on('url-updated', callback)
});
