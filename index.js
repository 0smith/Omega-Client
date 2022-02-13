const { app, ipcMain, BrowserWindow, shell } = require("electron");
const path = require("path");

let mainWindow;
let AppData = app.getPath("appData")

function ShowApp() {
    mainWindow.show()
    splash.close();
};

function createWindow() {
    mainWindow = new BrowserWindow({
        menu: false,
        title: "En Dev",
        icon: path.join(__dirname, "assets/img/logo.png"),
        width: 1300,
        minWidth: 1300,
        maxWidth: 1300,
        height: 750,
        minHeight: 750,
        maxHeight: 750,
        show: false,
        transparent: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
        },
    });
    mainWindow.loadFile(path.join(__dirname, "index.html")).then(() => {
        console.log("> La mainWindow vient de se contruire.");
    });
    // Création du Splash Screen.
    splash = new BrowserWindow({ width: 300, icon: path.join(__dirname, "assets/img/logo.png"), height: 400, frame: false, alwaysOnTop: true, transparent: true });
    splash.loadFile(path.join(__dirname, 'loading.html'));
    console.log("> Le SplashScreen vient de se contruire.");
    mainWindow.once('ready-to-show', () => {
        setTimeout(ShowApp, 2900);
    });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.on('new-window', function(e, url) { // Ouvrir les URL dans le navigateur
        if ('file://' === url.substr(0, 'file://'.length)) {
            return;
        }
        e.preventDefault();
        shell.openExternal(url);
    });
};

//On crée la fenêtre quand l'app est prête
app.whenReady().then(createWindow)

//Quand toutes les fenêtres sont fermées, on quitte l'app (sauf pour MacOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit() }
})

//Si l'application est active mais n'a aucune fenêtre, on en lance une
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})