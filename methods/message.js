const Chat = require("../models").chat
const Message = require("../models").message
const { Op } = require("sequelize")
const findOrCreateChat = require("./chat")

const createMessage = async (sender, receiver, text) => {
    const message = await Message.create({
        text,
        senderId: sender
    })
    const chat = await findOrCreateChat(sender, receiver)
    message.setChat(chat.dataValues.id)
    return message

}

module.exports = createMessage