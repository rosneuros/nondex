const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  navigate: (action, url) => ipcRenderer.send('navigate', { action, url }),
  previewNavigate: (action, url) => ipcRenderer.send('preview-navigate', { action, url }),
  onUrlUpdated: (callback) => ipcRenderer.on('url-updated', callback),
  onPreviewUrlUpdated: (callback) => ipcRenderer.on('preview-url-updated', callback),
  sendPreviewBounds: (bounds) => ipcRenderer.send('set-preview-bounds', bounds)
});
