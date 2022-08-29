const express = require('express');

const app = express()
const port = process.env.PORT || 8080
const httpServer = require('http').createServer(app)



let connections = []


const io = require('socket.io')(httpServer);
io.on('connect' , (socket) => {
    connections.push(socket);
    console.log(`${socket.id} has connected`);

    socket.on('draw', (data) => {
        connections.forEach(con => {
            if(con.id !== socket.id) {
                con.emit('ondraw' , { x: data.x, y: data.y } );
            }
        });
    });

    socket.on('down' , (data) => {
        connections.forEach(con => {
            if(con.id !== socket.id) {
                con.emit('ondown' , { x: data.x, y: data.y } );
            }
        });
    });


    socket.on('disconnect' , (reason) => {
        console.log(`${socket.id} is disconected`);
        connections = connections.filter((con) => con.id !== socket.id);
    })
});

app.use(express.static("public"));



httpServer.listen(port, () => console.log(`Server started on port ${port}!`))