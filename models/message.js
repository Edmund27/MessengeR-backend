"use strict";
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    "message",
    {
      text: DataTypes.STRING,
      senderId: DataTypes.INTEGER,
    },
    {}
  );
  message.associate = function (models) {
    message.belongsTo(models.chat);
  };
  return message;
};
