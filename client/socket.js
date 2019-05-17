// Copyright (c) 2015 Eric Huang.MIT license.
// 12/14/2015

var dgram = require('dgram')

class Socket {
  constructor() {
    this.socket = dgram.createSocket('udp4')
    this.socket.on('error', function(err) {
      console.log('server error:\n' + err.stack)
      this.socket.close()
    })
  }
  setting(host, port) {
    this.host = host
    this.port = port
  }
  on(event, fn) {
    this.socket.on('message', fn)
  }
  send(msg) {
    var message = new Buffer(msg)
    this.socket.send(message, 0, message.length, this.port, this.host)
    console.log('send msg:' + msg)
    // var address=this.socket.address();
    // console.log("server listening "+address.address+":"+address.port);
  }
}

module.exports = Socket
