const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let serverProcess;
let serverPID;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  win.loadFile(path.join(__dirname, 'static', 'index.html'));
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  serverProcess = exec('python backend/server.py');
  
  serverProcess.on('exit', (code) => {    
    console.log(`Server process is ended. End code: ${code}`);
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server stdout: ${data}`);
    
    const pidMatch = data.toString().match(/Server PID: (\d+)/);
    if (pidMatch) {
        serverPID = parseInt(pidMatch[1], 10);
        console.log(`Received Server PID: ${serverPID}`);
    }
  });

  createWindow();
  
});

app.on('before-quit', () => {
  if (serverProcess) {
    try {
      console.log(`Killing serverProcess: ${serverProcess}`);
      process.kill(serverProcess, 'SIGTERM');
      setTimeout(() => {
        try {
          process.kill(serverProcess, 'SIGKILL');
          console.log(`Force killed serverProcess: ${serverProcess}`);
        } catch {
          console.log(`serverProcess ${serverProcess} is already terminated.`);
        }
      }, 2000);
    } catch (err) {
      console.error(`Failed to kill serverProcess: ${serverProcess}. Error: ${err.message}`);
    }
  }
  if (serverPID) {
    try {
      console.log(`Killing backend server PID: ${serverPID}`);
      process.kill(serverPID, 'SIGTERM');
      setTimeout(() => {
        try {
          process.kill(serverPID, 'SIGKILL');
          console.log(`Force killed server PID: ${serverPID}`);
        } catch {
          console.log(`Server PID ${serverPID} is already terminated.`);
        }
      }, 2000);
    } catch (err) {
      console.error(`Failed to kill server PID: ${serverPID}. Error: ${err.message}`);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log("Quit app...");
    app.quit();
    console.log("Complete quiting app...");
  }
});

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
