const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 4000
const User = require('./models').user;
const Chat = require('./models').chat;
const Message = require('./models').message;
const { Op } = require("sequelize")
const socketConnections = {}
const findOrCreateChat = require("./methods/chat")
const createMessage = require("./methods/message")
const auth = require("./auth/middleware");
const cloneDeep = require('lodash.clonedeep');
const _ = require('lodash')



app.use(cors());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
});

//sockets*************************
const io = socket(server);
io.sockets.on('connection', async (socket) => {
    socket.on('userLogin', async email => {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (user) {
            const users = await User.findAll({
                attributes: ['name', 'id', 'imageUrl']
            })
            //io.sockets.connected[socket.id].disconnect()
            const userId = user.id
            const chats = await Chat.findAll({
                where: Sequelize.or(
                    { user1Id: userId },
                    { user2Id: userId }
                ),
                include: [Message],
            })

            const chatsWithLastMessage = await chats.map(function (chat) {
                const lastMessage = chat.messages.length ? chat.messages[chat.messages.length - 1].text : []
                const senderId = chat.messages.length ? chat.messages[chat.messages.length - 1].senderId : null

                return {
                    user1Id: chat.user1Id,
                    user2Id: chat.user2Id,
                    senderId: senderId,
                    message: lastMessage
                }
            });
            //console.log("users", chatsWithLastMessage)

            const usersWithMessage = users.map(user => {
                const chatsWithMessage = chatsWithLastMessage.find(chat => user.id == chat.user1Id || user.id == chat.user2Id)
                //console.log("TEST", user.id, chatsWithMessage)
                user.dataValues.chat = chatsWithMessage ? chatsWithMessage : null
                return user;
            })
            console.log(usersWithMessage);

            // const usersWithMessage = users.map(function (user) {
            //     chatsWithLastMessage.map(function (chat) {
            //         //console.log("USER", user.id, "USER1 and USER2", chat.user1Id, chat.user2Id)
            //         if (user.id === chat.user1Id || user.id === chat.user2Id) {
            //             //console.log("SUCCESS", user.id)
            //             return {
            //                 user: user,
            //                 message: chat.message,
            //                 sender: chat.senderId
            //             }
            //         } else return


            //     })
            // })


            // console.log(usersWithMessage)
            socket.emit('usersData', usersWithMessage)
            socketConnections[user.id] = socket.id;
            //console.log("SOCKET CONNECTIONNNNNNNNNNNNNNNNNNNNN", socketConnections)
            io.emit('updatedOnlineUsers', socketConnections);

        }
    })

    socket.on('chat', async users => {
        const chat = await findOrCreateChat(users.user.id, users.receiver.id)
        if (chat.dataValues.messages) {
            socket.emit('pastMessages', chat.dataValues.messages)
        } else {
            socket.emit('pastMessages', [])
        }
    })

    console.log(`connection established via id: ${socket.id}`)
    socket.on('newMessage', async messageObject => {

        const { user, receiver, text } = messageObject
        const message = await createMessage(user.id, receiver.id, text)

        const emittingMessage = { ...message.dataValues, receiverId: receiver.id }
        socket.emit('incomingMessage', emittingMessage)
        //console.log("MESSAGE", emittingMessage)
        const receiverSocketId = socketConnections[receiver.id]
        socket.to(receiverSocketId).emit('incomingMessage', emittingMessage)
    })

    socket.on('disconnect', () => {
        function deleteBySocketId(socketId) {
            for (var userId in socketConnections) {
                if (socketConnections[userId] == socketId) {
                    delete socketConnections[userId];
                }
            }
        }
        deleteBySocketId(socket.id)
        //delete socketConnections[socket.id];
        //console.log("SOCKET DISCONNECTTTTTTT", socketConnections)
        io.emit('updatedOnlineUsers', socketConnections);
    });
})

//Sockets end *************************************

const loggerMiddleWare = require("morgan");
app.use(loggerMiddleWare("dev"));

const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);

const authMiddleWare = require("./auth/middleware");


app.post("/echo", (req, res) => {
    res.json({
        youPosted: {
            ...req.body
        }
    });
});

app.get("/", (req, res) => {
    res.send("Hi from express");
});
// // POST endpoint which requires a token for testing purposes, can be removed
// app.post("/authorized_post_request", authMiddleWare, (req, res) => {
//     // accessing user that was added to req by the auth middleware
//     const user = req.user;
//     // don't send back the password hash
//     delete user.dataValues["password"];

//     res.json({
//         youPosted: {
//             ...req.body
//         },
//         userFoundWithToken: {
//             ...user.dataValues
//         }
//     });
// });

app.patch('/users/:id/', auth, async (req, res, next) => {
    try {
        const userId = req.params.id
        const toUpdate = await User.findByPk(userId)

        const { imageUrl, name } = req.body
        let itemToUpdate

        if (!imageUrl) {
            const updated = await toUpdate.update({ name })
            res.json(updated)
        } else if (!name) {
            const updated = await toUpdate.update({ imageUrl })
            res.json(updated)
        } else {
            const updated = await toUpdate.update({ imageUrl, name })
            res.json(updated)
        }

    } catch (e) {
        next(e)
    }
})

// app.get('/users/:id/chats/messages/last', auth, async (req, res, next) => {
//     try {
//         const userId = req.params.id
//         //console.log("PARAMS ID", userId)

//         const chats = await Chat.findAll({
//             where: Sequelize.or(
//                 { user1Id: userId },
//                 { user2Id: userId }
//             ),
//             include: [Message],
//             //plain: true
//             //nest: true,
//             //order: [[Message, 'createdAt', 'ASC']]
//         })
//         //console.log("FIRST", chats)

//         const chatsWithLastMessage = await chats.map(function (chat) {
//             const lastMessage = chat.messages.length ? chat.messages[chat.messages.length - 1].text : []
//             const senderId = chat.messages.length ? chat.messages[chat.messages.length - 1].senderId : null
//             //{ id: chat.message.id, }
//             //console.log("FIRST:", chat)
//             //console.log("TEST111111111111111111", chat.messages)
//             return {
//                 user1Id: chat.user1Id,
//                 user2Id: chat.user2Id,
//                 senderId: senderId,
//                 message: lastMessage
//             }
//         });
//         // chatsWithLastMessage.map(function (chat) {
//         //     console.log("TEST22222222222222222", chatsWithLastMessage[0].messages)
//         // })
//         //const deep = _.cloneDeep(chatsWithLastMessage);

//         //console.log("SECOND:", chatsWithLastMessage)

//         res.json(chatsWithLastMessage);

//     } catch (e) {
//         next(e)
//     }
// })


const authRouter = require("./routers/auth");
const { Sequelize } = require('./models')
app.use("/", authRouter);


