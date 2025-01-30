# Installation
## 📌 Prerequisites
- **Node.js & npm installed**
- **created spotify app**
- follow link if not created app https://developer.spotify.com/documentation/web-api/concepts/apps
---
  
1. npm install
2. create *.env* file in project directory
3. add following:
  ```script
  CLIENT_ID = "your-spotify-client-id"
  CLIENT_SECRET = "your-spotify-client-secret"
  REDIRECT_URI = "redirect-uri"
  SCOPE = "user-read-private user-read-email user-read-currently-playing"
  ```
4. npm start


# Electron App - Create a Desktop Shortcut (Without CMD Panel)
## 📌 Prerequisites
- **Node.js & npm installed**
- **Electron app setup and working**

---
### Use a VBScript File
1. Create a new file in your project directory:
   **`startApp.vbs`**
2. Add the following code:
   ```vbscript
   Set WshShell = CreateObject("WScript.Shell")
   WshShell.Run "cmd /c cd /d C:\path\to\your\project && npm start", 0, False
   Set WshShell = Nothing
   ```
3. **Replace** `C:\path\to\your\project` with your actual project path.
4. Save and create a **shortcut** to `startApp.vbs` on your Desktop.
5. **Double-click** the shortcut to launch the Electron app **silently** (without CMD popping up).

## 🚀 Now Your Electron App Will Start Without CMD!

