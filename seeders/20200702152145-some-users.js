"use strict";
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "dummy1",
          email: "dummy1@dummy.com.com",
          password: bcrypt.hashSync("dummy", SALT_ROUNDS),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dummy2",
          email: "dummy2@dummy.com",
          password: bcrypt.hashSync("dummy", SALT_ROUNDS),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dummy3",
          email: "dummy3@dummy.com",
          password: bcrypt.hashSync("dummy", SALT_ROUNDS),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "dummy4",
          email: "dummy4@dummy.com",
          password: bcrypt.hashSync("dummy", SALT_ROUNDS),
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
