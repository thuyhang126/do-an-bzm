'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender_id: DataTypes.STRING,
    receiver_id: DataTypes.STRING,
    message: DataTypes.STRING,
    seen_at: DataTypes.DATE,
    sent_at: DataTypes.DATE,
  }, {
    timestamps: false,
    tableName: 'messages'
  });

  Message.associate = models => {
    Message.belongsTo(models.User, {
      as: 'messages',
      foreignKey: 'sender_id',
      timestamps: false,
    });
  };

  return Message;
};
