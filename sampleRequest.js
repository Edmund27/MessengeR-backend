const Chat = require("./models").chat
const Message = require("./models").message
const { Op } = require("sequelize")

async function findOrCreateConversation(user1Id, user2Id) {
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
            order: [[Message, 'createdAt', 'DESC']]
        }
    )
    console.log("CHAT:", chat)
}
//setTimeout(() => findOrCreateConversation(1, 2), 5000)
findOrCreateConversation(3, 1)
