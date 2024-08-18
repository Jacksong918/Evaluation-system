const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow;

// 创建浏览器窗口时，调用这个函数
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // 加载本地 Vue 项目
    mainWindow.loadURL('http://localhost:3000');  // 确保这个URL是你的Vue项目的本地开发地址

    // 打开开发者工具
    mainWindow.webContents.openDevTools();

    // 发送命令行参数到渲染进程
    // console.log('Received file path:', filepath);

    // mainWindow.webContents.on('did-finish-load', () => {
    //     mainWindow.webContents.send('file-path', filepath);
    // });


    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// Electron 会在初始化后并准备好创建浏览器窗口时调用这个函数
app.whenReady().then(() => {
    // 仅在不设置 DISABLE_AUTO_LAUNCH 窗口时创建窗口
    if (!process.env.DISABLE_AUTO_LAUNCH) {
        createWindow();
    }
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

// 监听读取文件请求
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
});