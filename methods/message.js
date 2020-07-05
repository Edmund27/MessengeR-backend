const Chat = require("../models").chat
const Message = require("../models").message
const { Op } = require("sequelize")
const findOrCreateChat = require("./chat")

const createMessage = async (sender, receiver, text) => {
    console.log("SENDER ID, RECEIVER ID", sender, receiver)
    const message = await Message.create({
        text,
        senderId: sender
    })
    const chat = await findOrCreateChat(sender, receiver)
    message.setChat(chat.dataValues.id)
    //console.log("THIS IS THE MESSAGE", chat)
    return message

}

module.exports = createMessage