"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "dummy1",
          password: "test1234",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dummy2",
          password: "dummy",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dummy3",
          password: "dummy",
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
