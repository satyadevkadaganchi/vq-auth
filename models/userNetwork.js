module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("userNetwork", {
      networkId: { type: DataTypes.STRING },
      network: { type: DataTypes.STRING },
      token: { type: DataTypes.STRING },
      refreshToken: { type: DataTypes.STRING }
  }, {
    tableName: 'userNetwork',
    classMethods: {
        associate: models => {
            Model.belongsTo(models.user);
            Model.belongsTo(models.app);
        }
    }
  });

  return Model;
};