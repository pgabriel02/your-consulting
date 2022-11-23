module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Jonctiune', {
    });
    model.belongsTo(sequelize.models.Persoane, {foreignKey: 'id_person', onDelete: 'cascade'});
    model.belongsTo(sequelize.models.Masini, {foreignKey: 'id_car', onDelete: 'cascade'})
    return model;
  };
  