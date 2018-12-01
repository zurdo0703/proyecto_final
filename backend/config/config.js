let config = {};

config.application = {};
config.application.host = 'localhost:3000';
config.application.maxItemsPerPage = 100;
config.application.xPowerBy='mi aplicacion';

config.database = {};
config.database.dialect = "mysql";
config.database.username = "root";
config.database.password = "CwqSoIu9pZMorHuZ";
config.database.port = "3306";
config.database.host = "phenixbytes.com";
config.database.database = "proyecto_juan_edwin";
config.database.operatorsAliases = false;

config.database.pool = {};
config.database.pool.max = 5;
config.database.pool.min = 0;
config.database.pool.acquire = 30000;
config.database.pool.idle = 10000;
config.database.operatorsAliases = false;

config.sequelize = {};
config.sequelize.sync = {};
config.sequelize.sync.force = true;
config.sequelize.sync.logging = null;

config.crypto = {};
config.crypto.salt = "o8y¿¡nw4v5@pym5+pq98y oq w6 j{w5{6´j w{56o,jw4*pi6mjr46w59phu$sa(q4n5)hñq45hñq3";

config.uploads = {};
config.uploads.defaultTmpUpload = 'uploads';
config.uploads.defaultPrivateFolder = 'public/files/private';
config.uploads.defaultPrivateUpload = `${config.uploads.defaultPrivateFolder}/tmp/`;
config.uploads.filenameLength = 32;


config.validate = {};
config.validate.thumbnailUrl = /^\/private(\/(\d+)x(\d+))?\/(.*)+\/?$/;

module.exports = config;