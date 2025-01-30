const {app, BrowserWindow, shell, ipcMain}  = require('electron');
const path = require('node:path')
const fs = require('node:fs');
const { worker, state, getToken, fetchProfile, getCurrentTrack } = require('./actions');

require("dotenv").config()


function createWindow(){
    global.win = new BrowserWindow({
        width:600,
        height:250,
        alwaysOnTop:true,
        frame:false,
        transparent:true,
        webPreferences:{
            preload:path.join(__dirname,"./preload.js")
        }
    })

    win.loadFile('./index.html')
}

app.whenReady().then(()=>{
    if(!fs.existsSync('token.json')){
        logIn()
    }
    createWindow()
})

function logIn(){
    worker.postMessage('startserver')

    const params = new URLSearchParams()
    params.append('response_type', 'code');
    params.append('client_id', process.env.CLIENT_ID );
    params.append('scope',process.env.SCOPE );
    params.append('redirect_uri', process.env.REDIRECT_URI);
    params.append('state', state)

    // open this url in browser for user login and authorization
    shell.openExternal(`https://accounts.spotify.com/authorize?${params}`)
}

//   handle token generation request
ipcMain.handle('generateToken',()=>logIn())

// handles user profile request
// return -2 if token expired
ipcMain.handle('fetchProfile',fetchProfile)

// handle current track request
// return -1 if no song playing
// return -2 if token expired
ipcMain.handle('fetchCurrentTrack',getCurrentTrack)

ipcMain.handle('logIn',()=>{
    logIn()
})

ipcMain.handle('resize',(event,width,height)=>{
    win.setSize(width,height)
})

ipcMain.handle('closeWindow',()=>{
    win.close()
})