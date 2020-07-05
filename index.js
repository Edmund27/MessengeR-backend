const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')
const PORT = 4000
const User = require('./models').user;
const Chat = require('./models').chat;
const Message = require('./models').message;
const { Op } = require("sequelize")
const socketConnections = {}
const findOrCreateChat = require("./methods/chat")
const createMessage = require("./methods/message")


app.use(cors());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
});

const io = socket(server);
io.sockets.on('connection', async (socket) => {
    const users = await User.findAll()
    socket.emit('sendUsers', users)
    socket.on('newUser', async credentials => {
        const { name, password } = credentials
        //console.log("CREDENTIALS:", name, password)
        const user = await User.findOrCreate({
            where: {
                name,
                password
            }
        })
        const users = await User.findAll()
        socketConnections[user[0].id] = socket.id;
        //console.log("MOBILE SOCKETS", socketConnections)
        //console.log("USERS:", user, users)
        socket.emit('userCreated', { user: user[0], users })
    })

    // socket.on('ongoingChats', async user => {
    //     console.log(user)
    //     // const chats = await Chat.findAll({
    //     //     where: {
    //     //         // user1Id: {
    //     //         //     [Op.or]: user.id
    //     //         // },
    //     //         // user2Id: {
    //     //         //     [Op.or]: user.id
    //     //         // },
    //     //         user1Id: user.id || user2Id: user.id
    //     //     },
    //     //         include: [Message],
    //     //         order: [[Message, 'createdAt', 'DESC']]
    //     //     }
    //     // })
    //     // console.log("TEST CHATS:", chats)
    //     // socket.emit('chatsFound', chats)
    // })

    socket.on('chat', async users => {
        const chat = await findOrCreateChat(users.user.id, users.receiver.id)
        // const user1Id = parseInt(users.user.id)
        // const user2Id = parseInt(users.receiver.id)
        // //console.log('USERS TEST:', user1Id, user2Id)
        // const chat = await Chat.findOrCreate(
        //     {
        //         where: {
        //             user1Id: {
        //                 [Op.or]: [user1Id, user2Id]
        //             },
        //             user2Id: {
        //                 [Op.or]: [user1Id, user2Id]
        //             }
        //         },
        //         include: [Message],
        //         order: [[Message, 'createdAt', 'DESC']]
        //     }
        // )
        if (chat.dataValues.messages) {
            socket.emit('pastMessages', chat.dataValues.messages)
        } else {
            socket.emit('pastMessages', [])
        }
        //console.log("MOBILE SOCKETS", socketConnections)
    })

    console.log(`connection established via id: ${socket.id}`)
    socket.on('newMessage', async messageObject => {
        const { user, receiver, text } = messageObject
        console.log("MESSAGEEEEEEEEE", messageObject)
        // const message = await Message.create({
        //     text,
        //     senderId: user.id
        // })
        // findOrCreateChat(user.id, receiver.id)
        const message = await createMessage(user.id, receiver.id, text)
        socket.emit('incomingMessage', message)
        const receiverSocketId = socketConnections[receiver.id]
        socket.to(receiverSocketId).emit('incomingMessage', message)
        //console.log(`${messageObject.userName}: ${messageObject.message}`)
        //io.emit('chat', messageObject)
    })
})
