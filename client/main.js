const Socket = require('./socket')
const electron = require('electron')
const app = electron.app
const ipcMain = electron.ipcMain
const BrowserWindow = electron.BrowserWindow

var mainWindow
app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 409,
    show: true,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.loadURL('file://' + __dirname + '/app/index.html')
})

var socket = new Socket()
// socket.setting('127.0.0.1',55962);
socket.on('message', function(msg, info) {
  console.log('server got:' + msg + ' from ' + info.address + ':' + info.port)
  mainWindow.webContents.send('msg', msg)
})
// console.log("port:"+server.address().port)
// socket.send("hello world")
ipcMain.on('msg', function(event, data) {
  socket.send(data)
})
ipcMain.on('setting', function(event, data) {
  console.log('data:' + data)
  list = data.split(':')
  console.log('address:' + list[0] + ' port:' + list[1])
  socket.setting(list[0], parseInt(list[1]))
})
