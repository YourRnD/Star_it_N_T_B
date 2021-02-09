const mysql = require('mysql');
const config = require('../config');

const connection = mysql.createConnection({
    host: config.HOST,
    port: config.PORT,
    user: config.DBUSER,
    password: config.DBPASSWORD,
    database: config.DBNAME
});

connection.connect((error) => {
    if(error) {
        return console.log('Ошибка подключения к БД', error);
    } else {
        return console.log('Подключение успешно');
    }
});

module.exports = connection;