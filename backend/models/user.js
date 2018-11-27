"use strict";

var crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set: function (password) {
                this.setDataValue('password', crypto.createHmac('sha256', config.crypto.salt)
                    .update(password)
                    .digest('hex'));
            },
            get: function () {
                return '*****';
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // default values for dates => current time
        birthday: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: true,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of table names; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: false,

            // define the table's name
            tableName: 'user',

            // Enable optimistic locking.  When enabled, sequelize will add a version count attribute
            // to the model and throw an OptimisticLockingError error when stale instances are saved.
            // Set to true or a string with the attribute name you want to use to enable.
            version: false
        });

    User.associate = models => {
        //asociar los roles
        User.belongsToMany(models.Role, {
            as: 'Roles',
            through: 'user_role',
            foreignKey: 'user'
        });

        User.belongsTo(models.File, {
            foreignKey: 'photo'
        });
    };

    return User;
};