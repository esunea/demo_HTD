import { io } from 'socket.io';
import { createServer } from 'http'

export class SocketHandler {
    socket :Array<any> = []
    // constructor(){
    //     var 
    //     sockets.on('connection',()=>{
    //         console.log('client here')
    //     })
    // }
    constructor(){
        console.log("socket")
        var http = require('http');
        var fs = require('fs');
        
        // Chargement du fichier index.html affiché au client
        var server = http.createServer(function(req, res) {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end("plop");
        });
        
        // Chargement de socket.io
        var io = require('socket.io').listen(server);
        
        // Quand un client se connecte, on le note dans la console
        io.sockets.on('connection', (socket) =>{
            console.log('Un client est connecté !');
            this.socket.push(socket)
        });
        
        
        server.listen(8080);
    }
    
    sendMessage(message: string) {
        // console.log('in sendMessage and socket is: ', this.socket);
        this.socket.forEach(socket=>{
            socket.emit('message', message);
        })
    }
}
