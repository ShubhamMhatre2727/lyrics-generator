const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electronAPI",{
    logIn:()=>ipcRenderer.invoke('logIn'),
    generateToken:()=>ipcRenderer.invoke('generateToken'),
    getProfile:()=>ipcRenderer.invoke('fetchProfile'),
    getCurrentTrack:()=>ipcRenderer.invoke('fetchCurrentTrack'),
    resize:(width,height)=>ipcRenderer.invoke('resize',width,height),
    closeWindow:()=>ipcRenderer.invoke('closeWindow')
})