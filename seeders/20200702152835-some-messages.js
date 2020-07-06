"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "messages",
      [
        {
          text: 'hey',
          senderId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: 1
        },
        {
          text: 'how are you',
          senderId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: 1
        },
        {
          text: 'good',
          senderId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: 1
        },
        {
          text: 'hey',
          senderId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: 1
        },
        {
          text: 'how are you',
          senderId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: 1
        },
        {
          text: 'good',
          senderId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: 1
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("messages", null, {});
  },
};

