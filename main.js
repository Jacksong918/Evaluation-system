const { app, BrowserWindow, ipcMain } = require('electron')
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

    // 获取命令行第一个参数作为文件路径
    let filePath1 = process.argv[1];
    let filePath2 = process.argv[2]; 

    if (filePath1 && fs.existsSync(filePath1)) {
        console.log('Valid first file path.', filePath1);
    } else {
        console.error('Invalid or missing first file path.');
        filePath1 = null; // 设置为 null 以避免尝试加载不存在的文件
    }
    // 验证文件路径1
    if (filePath2 && fs.existsSync(filePath2)) {
        console.log('Valid second file path:', filePath2);
    } else {
        console.error('Invalid or missing second file path.');
        filePath2 = null; 
    }


    // 加载本地 Vue 项目
    // mainWindow.loadURL('http://localhost:3000');  // 确保这个URL是你的Vue项目的本地开发地址
    mainWindow.loadFile("./dist/index.html")  // 打包用

    // 打开开发者工具
    // mainWindow.webContents.openDevTools();

    // 确保页面已加载完成，然后发送文件路径
    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.send('file-paths', { filePath1, filePath2 });
        console.log('File paths sent to renderer:', filePath1, filePath2);
    });

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