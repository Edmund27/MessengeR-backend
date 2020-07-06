"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          name: "dummy1",
          password: "abc",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "dummy2",
          password: "abc",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "dummy3",
          password: "abc",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
