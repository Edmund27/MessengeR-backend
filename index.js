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
const auth = require("./auth/middleware");


app.use(cors());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port:${PORT}`);
});

//sockets*************************
const io = socket(server);
io.sockets.on('connection', async (socket) => {
    // const users = await User.findAll()
    // console.log('USERS TEST', users)
    //socket.emit('sendUsers', users)
    socket.on('userLogin', async email => {
        console.log("AGAIN *************************", email)
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (user) {
            const users = await User.findAll({
                attributes: ['name', 'id', 'imageUrl']
            })
            socketConnections[user.id] = socket.id;
            socket.emit('usersData', users)
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
        socket.emit('incomingMessage', message)

        const receiverSocketId = socketConnections[receiver.id]
        socket.to(receiverSocketId).emit('incomingMessage', message)
    })
})

//Sockets end *************************************

const loggerMiddleWare = require("morgan");
app.use(loggerMiddleWare("dev"));

const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);

const authMiddleWare = require("./auth/middleware");

app.get("/", (req, res) => {
    res.send("Hi from express");
});

app.post("/echo", (req, res) => {
    res.json({
        youPosted: {
            ...req.body
        }
    });
});

// POST endpoint which requires a token for testing purposes, can be removed
app.post("/authorized_post_request", authMiddleWare, (req, res) => {
    // accessing user that was added to req by the auth middleware
    const user = req.user;
    // don't send back the password hash
    delete user.dataValues["password"];

    res.json({
        youPosted: {
            ...req.body
        },
        userFoundWithToken: {
            ...user.dataValues
        }
    });
});

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

        console.log("WHAT IS USERS ID", userId, "imageUrl", imageUrl, "name", name)
        //res.json(updated)
    } catch (e) {
        next(e)
    }
})


const authRouter = require("./routers/auth");
app.use("/", authRouter);


