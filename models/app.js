module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("app", {
      app_name: { type: DataTypes.STRING },
      app_key: { type: DataTypes.STRING },
      api_key: { type: DataTypes.STRING }
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