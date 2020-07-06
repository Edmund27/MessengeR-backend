"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "chats",
      [
        {
          id: 1,
          user1Id: 1,
          user2Id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          user1Id: 3,
          user2Id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          user1Id: 2,
          user2Id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("chats", null, {});
  },
};

