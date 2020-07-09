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
        return chat
    } else {
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


