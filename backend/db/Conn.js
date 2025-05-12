const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('eternalnexus_', 'eternalnexus_', 'T1?86wkr2', {
    host: '186.209.113.134',
    dialect: 'mysql',
    port: 3306,
});

module.exports = sequelize;