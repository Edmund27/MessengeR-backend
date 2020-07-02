"use strict";
module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define(
    "chat",
    {
    },
    {}
  );
  chat.associate = function (models) {
    chat.belongsTo(models.user, {
      foreignKey: "user1Id",
      //as: "user1"
    });
    chat.belongsTo(models.user, {
      foreignKey: "user2Id",
      //as: "user2"
    });
    chat.hasMany(models.message);
  };
  return chat;
};