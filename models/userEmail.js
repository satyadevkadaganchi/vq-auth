module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("userEmail", {
      email: { type: DataTypes.STRING },
      verified: { type: DataTypes.BOOLEAN }
  }, {
    tableName: 'userEmail',
    classMethods: {
        associate: models => {
            Model.belongsTo(models.user);
        }
    }
  });

  return Model;
};
