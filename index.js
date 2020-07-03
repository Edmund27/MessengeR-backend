const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')
const PORT = 4000
const User = require('./models').user;
const Chat = require('./models').chat;
const Message = require('./models').message;
const mobileSockets = {}

app.use(cors());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
});

const io = socket(server);
io.on('connection', (socket) => {
    socket.on('newUser', async credentials => {
        const { name, password } = credentials
        console.log("CREDENTIALS:", name, password)
        const user = await User.findOrCreate({
            where: {
                name,
                password
            }
        })
        const users = await User.findAll()
        console.log("USERS:", user, users)
        socket.emit('userCreated', { user: user[0], users })
    })

    console.log(`connection established via id: ${socket.id}`)

    socket.on('chat', messageObject => {
        console.log(`${messageObject.userName}: ${messageObject.message}`)
        io.emit('chat', messageObject)
    })
})
