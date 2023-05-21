'use strict';

module.exports = (sequelize, DataTypes) => {
   const Role = sequelize.define('Role', {
      name: DataTypes.STRING,
      display_name: DataTypes.STRING,
      descriptions: DataTypes.STRING,
      created_at: 'TIMESTAMP',
      updated_at: 'TIMESTAMP',
   }, {
      tableName: 'roles'
   });

   Role.associate = models => {
      Role.belongsToMany(models.User, {
         as: 'users',
         through: 'role_user',
         foreignKey: 'role_id',
         otherKey: 'user_id',
         timestamps: false
      });
   };

   return Role;
};
