"use strict";const{app:t,BrowserWindow:r,ipcMain:a}=require("electron"),s=require("fs");process.env.ELECTRON_DISABLE_SECURITY_WARNINGS="true";let o;const l=()=>{o=new r({width:800,height:600,webPreferences:{nodeIntegration:!0,contextIsolation:!1}});let n=process.argv[1],e=process.argv[2];n&&s.existsSync(n)?console.log("Valid first file path.",n):(console.error("Invalid or missing first file path."),n=null),e&&s.existsSync(e)?console.log("Valid second file path:",e):(console.error("Invalid or missing second file path."),e=null),o.loadFile("./dist/index.html"),o.webContents.once("did-finish-load",()=>{o.webContents.send("file-paths",{filePath1:n,filePath2:e}),console.log("File paths sent to renderer:",n,e)}),o.on("closed",function(){o=null})};t.whenReady().then(()=>{process.env.DISABLE_AUTO_LAUNCH||l(),t.on("activate",()=>{r.getAllWindows().length===0&&l()})});t.on("window-all-closed",()=>{process.platform!=="darwin"&&t.quit()});a.handle("read-file",async(n,e)=>{try{return s.readFileSync(e,"utf8")}catch(i){throw console.error("Error reading file:",i),i}});
