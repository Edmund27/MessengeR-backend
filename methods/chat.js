const Chat = require("../models").chat
const Message = require("../models").message
const { Op } = require("sequelize")


const findOrCreateChat = async (user1Id, user2Id) => {
    const chat = await Chat.findOne(
        {
            where: {
                user1Id: {
                    [Op.or]: [user1Id, user2Id]
                },
                user2Id: {
                    [Op.or]: [user1Id, user2Id]
                }
            },
            include: [Message],
            order: [[Message, 'createdAt', 'ASC']]
        }
    )
    if (chat) {
        //console.log(chat)
        return chat
    } else {
        //console.log("WHAT IS CHAT", chat)
        return (
            await Chat.create({
                user1Id: user1Id,
                user2Id: user2Id
            }, {
                include: [Message],
                order: [[Message, 'createdAt', 'DESC']]
            })
        )
    }
}

module.exports = findOrCreateChat


