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
    });
    chat.belongsTo(models.user, {
      foreignKey: "user2Id",
    });
    chat.hasMany(models.message);
  };
  return chat;
};