"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {}
  );
  user.associate = function (models) {
    user.hasMany(models.chat, {
      foreignKey: "user1Id"
    });
    user.hasMany(models.chat, {
      foreignKey: "user2Id"
    });
  };
  return user;
};
