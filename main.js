const { app, BrowserWindow, ipcMain } = require('electron');
const { WebContentsView } = require('electron');
const path = require('path');

let mainWindow;
let contentView;
let previewView;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  contentView = new WebContentsView({
    webPreferences: { backgroundThrottling: false }
  });
  mainWindow.contentView.addChildView(contentView);
  contentView.webContents.loadURL('https://www.example.com');

  previewView = new WebContentsView({
    webPreferences: { backgroundThrottling: false }
  });
  mainWindow.contentView.addChildView(previewView);
  previewView.webContents.loadURL('https://www.google.com');

  updateBounds();

  contentView.webContents.on('did-finish-load', () => console.log('Content loaded'));
  contentView.webContents.on('did-fail-load', (e, code, desc) => console.error(`Fail: ${code} - ${desc}`));

  contentView.webContents.setWindowOpenHandler(({ url }) => {
    contentView.webContents.loadURL(url);
    return { action: 'deny' };
  });

  previewView.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('preview-url-updated', previewView.webContents.getURL());
  });

  mainWindow.on('resize', updateBounds);
}

function updateBounds() {
  const winBounds = mainWindow.getBounds();
  contentView.setBounds({ x: 200, y: 60, width: winBounds.width - 200, height: winBounds.height - 60 });
}

ipcMain.on('set-preview-bounds', (event, bounds) => {
  previewView.setBounds(bounds);
});

ipcMain.on('navigate', (event, { action, url }) => {
  console.log(`Navigating main: ${action} to ${url}`);
  if (action === 'load') contentView.webContents.loadURL(url);
  if (action === 'back') contentView.webContents.goBack();
  if (action === 'forward') contentView.webContents.goForward();
  if (action === 'reload') contentView.webContents.reload();
  if (action === 'home') contentView.webContents.loadURL('https://www.example.com');

  contentView.webContents.once('did-navigate', () => {
    mainWindow.webContents.send('url-updated', contentView.webContents.getURL());
  });
});

ipcMain.on('preview-navigate', (event, { action, url }) => {
  console.log(`Navigating preview: ${action} to ${url}`);
  if (action === 'load') previewView.webContents.loadURL(url);

  previewView.webContents.once('did-navigate', () => {
    mainWindow.webContents.send('preview-url-updated', previewView.webContents.getURL());
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
