"use strict";

module.exports = (sequelize, DataTypes) => {
    let Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        id_file: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: true,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of table names; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,

            // define the table's name
            tableName: 'post',

            // Enable optimistic locking.  When enabled, sequelize will add a version count attribute
            // to the model and throw an OptimisticLockingError error when stale instances are saved.
            // Set to true or a string with the attribute name you want to use to enable.
            version: false
        });

    Post.associate = models => {
        Post.belongsTo(models.File, {
            foreignKey: 'post'
        });
 
        Post.belongsTo(models.User, {
            foreignKey: 'user'
        });
    };

    return Post;
};