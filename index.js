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

    socket.on('chat', messageObject => {
        console.log(`${messageObject.userName}: ${messageObject.message}`)
        io.emit('chat', messageObject)
    })
})

// SERVER:
const loggerMiddleWare = require("morgan");
const authRouter = require("./routers/auth");
const authMiddleWare = require("./auth/middleware");

app.use(loggerMiddleWare("dev"));

const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hi from express");
});

// POST endpoint for testing purposes, can be removed
app.post("/echo", (req, res) => {
    res.json({
        youPosted: {
            ...req.body,
        },
    });
});

app.post("/authorized_post_request", authMiddleWare, (req, res) => {
    // accessing user that was added to req by the auth middleware
    const user = req.user;
    // don't send back the password hash
    delete user.dataValues["password"];

    res.json({
        youPosted: {
            ...req.body,
        },
        userFoundWithToken: {
            ...user.dataValues,
        },
    });
});

app.use("/", authRouter);

// Listen for connections on specified port (default is port 4000)

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});


