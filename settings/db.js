const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://ymksidldgvqttv:f6dd4524fdfa3baec99ff8bd764a6ad67fd7dbdce641ae630bfcdb6262522b7a@ec2-34-247-118-233.eu-west-1.compute.amazonaws.com:5432/dkmdbhakh09m7',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect((error) => {
  if (error) {
    return console.log('Ошибка подключения к БД', error);
  } else {
    return console.log('Подключение успешно');
  }
});

module.exports = client;