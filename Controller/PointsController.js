'use strict';

const response = require('./../response');
const db = require('../settings/db');

// api/points/getAllPoints
exports.getAllPoints = (req, res) => {

    db.query('SELECT `id`, `name`, `address` FROM `points`', (error, rows, fields) => {
        if (error) {
            response.status(404, error, res);
        } else {
            response.status(200, rows, res)
        }
    });

}

// api/points/setPoint
exports.setPoint = (req, res) => {

    db.query('SELECT `id`, `name`, `address` FROM `points` WHERE `name` = "' + req.body.name + '" && `address` = "' + req.body.address + '"', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            response.status(302, {message: 'This organization already exists'}, res);
        } else {
            const address = req.body.address,
                  name = req.body.name;

            const sql = 'INSERT INTO `points`(`name`, `address`)' +
                        'VALUES ("' + name + '", "' + address + '")';

            db.query(sql, (error, results) => {
                if (error) {
                    response.status(400, error, res);
                } else {
                    response.status(200, {message: 'Организация успешно добавлена', results}, res);
                }
            });
        }
    }); 

}
