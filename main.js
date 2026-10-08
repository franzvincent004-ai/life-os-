const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
function create() {
  const win = new BrowserWindow({
    width: 1200, height: 850, minWidth: 380, backgroundColor: '#000000',
    title: 'Life OS', icon: path.join(__dirname, 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
