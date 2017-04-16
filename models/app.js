module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("app", {
      appName: { type: DataTypes.STRING },
      appKey: { type: DataTypes.STRING },
      apiKey: { type: DataTypes.STRING }
  }, {
    tableName: 'app',
    classMethods: {
        associate: models => {
            Model.belongsTo(models.account);
        }
    }
  });

  return Model;
};