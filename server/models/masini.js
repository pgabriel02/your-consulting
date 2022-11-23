module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Masini', {
      Denumire_marca: {
        type: DataType.STRING,
        validate: {len: [0,255]},
        allowNull: false
      },
      Denumire_model: {
        type: DataType.STRING,
        validate: {len: [0,255]},
        allowNull: false
      },
      Anul_fabricatiei: {
        type: DataType.INTEGER,
        validate: {len: [0,4]},
        allowNull: false
      },
      Capacitate_cilindrica: {
        type: DataType.INTEGER,
        validate: {len: [0,4]},
        allowNull: false
      },
      Taxa_de_impozit: {
        type: DataType.INTEGER,
        validate: {len: [0,4]},
        allowNull: false
      },
    }, {
      timestamps: true
    });
    model.associate = (models) => {
      model.hasMany(models.Jonctiune, {
        foreignKey: 'id'
      })
    }
    /*
      Aceasta linie este comentata pentru a demonstra legatura dintre tabelul Information si tabelul Post prin id
    */
    // model.belongsTo(sequelize.models.Post, {foreignKey: 'id_post', onDelete: 'set null'});
    return model;
  };
  