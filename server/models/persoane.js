module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Persoane', {
      nume: {
        type: DataType.STRING,
        validate: {len: [0,255]},
        allowNull: false
      },
      prenume: {
        type: DataType.STRING,
        validate: {len: [0,255]},
        allowNull: false
      },
      CNP: {
        type: DataType.STRING,
        validate: {len: [0,13]},
        allowNull: false
      },
      Varsta: {
        type: DataType.INTEGER,
        validate: {len: [0,3]},
        allowNull: false
      },
    }, {
      timestamps: true
    });
    /*
      Aceasta linie este comentata pentru a demonstra legatura dintre tabelul Information si tabelul Post prin id
    */
    // model.belongsTo(sequelize.models.Post, {foreignKey: 'id_post', onDelete: 'set null'});
    return model;
  };
  