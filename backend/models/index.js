const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(config.database);

//read entities
var db = {};

fs.readdirSync(__dirname)
    .filter(file => ((file.indexOf(".") !== 0) && (file !== "index.js")))
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName])
        db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;