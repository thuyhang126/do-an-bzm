'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interaction = sequelize.define('Interaction', {
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    created_at: 'TIMESTAMP',
  }, {
    timestamps: false,
    tableName: 'interactions'
  });

  Interaction.associate = models => {
    Interaction.belongsTo(models.User, {
      as: 'interaction',
      foreignKey: 'sender_id',
      timestamps: false,
    });
  };

  return Interaction;
};
