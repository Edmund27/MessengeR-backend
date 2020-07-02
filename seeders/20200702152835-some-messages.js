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
        },
        {
          text: 'how are you',
          senderId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: 'good',
          senderId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: 'hey',
          senderId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: 'how are you',
          senderId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: 'good',
          senderId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("messages", null, {});
  },
};

