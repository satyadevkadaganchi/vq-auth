module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("userEmail", {
      email: { type: DataTypes.STRING },
      verified: { type: DataTypes.BOOL }
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
