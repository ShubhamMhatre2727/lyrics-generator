# Electron App - Create a Desktop Shortcut (Without CMD Panel)
## 📌 Prerequisites
- **Node.js & npm installed**
- **Electron app setup and working**

---
Use a VBScript File
### **Steps:**
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

