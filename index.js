const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')
const PORT = 4000

app.use(cors());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
});

const io = socket(server);
io.on('connection', (socket) => {
    console.log(`connection established via id: ${socket.id}`)

    socket.on('chat', data => {
        console.log(`${data.userName}: ${data.message}`)
        socket.emit('chat', data)
    })
})
