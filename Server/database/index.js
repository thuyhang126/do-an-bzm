'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('@config/database');
const db = {};
const modelDir = path.resolve('app/components/core/models');

let sequelize = new Sequelize(config.database, config.username, config.password, config);
let models = [];

if(fs.existsSync(modelDir)) {
  fs.readdirSync(modelDir)
  .forEach(file => {
    const model = require(path.join(modelDir, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
}

if(db) {
  Object.keys(db).forEach(modelName => {
    if(models.indexOf(modelName) === -1) {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    }

    models.push(modelName);
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
