"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
require("path");
const fs = require("fs");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  let filePath1 = process.argv[1];
  let filePath2 = process.argv[2];
  if (filePath1 && fs.existsSync(filePath1)) {
    console.log("Valid first file path.", filePath1);
  } else {
    console.error("Invalid or missing first file path.");
    filePath1 = null;
  }
  if (filePath2 && fs.existsSync(filePath2)) {
    console.log("Valid second file path:", filePath2);
  } else {
    console.error("Invalid or missing second file path.");
    filePath2 = null;
  }
  mainWindow.loadURL("http://localhost:3000");
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.once("did-finish-load", () => {
    mainWindow.webContents.send("file-paths", { filePath1, filePath2 });
    console.log("File paths sent to renderer:", filePath1, filePath2);
  });
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
};
app.whenReady().then(() => {
  if (!process.env.DISABLE_AUTO_LAUNCH) {
    createWindow();
  }
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
});
