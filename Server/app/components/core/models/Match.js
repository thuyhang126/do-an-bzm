'use strict';

module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    user_id: DataTypes.STRING,
    object_id: DataTypes.INTEGER,
    created_at: 'TIMESTAMP',
  }, {
    timestamps: false,
    tableName: 'matches'
  });

  Match.associate = models => {
    Match.belongsTo(models.User, {
      as: 'matches',
      foreignKey: 'user_id',
      timestamps: false,
    });
  };

  return Match;
};
