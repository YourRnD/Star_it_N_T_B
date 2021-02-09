'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const response = require('./../response');
const db = require('../settings/db');

// api/users/getAllUsers
exports.getAllUsers = (req, res) => {

    db.query('SELECT `id`, `name`, `second_name`, `email` FROM `users`', (error, rows, fields) => {
        if (error) {
            response.status(404, error, res);
        } else {
            response.status(200, rows, res)
        }
    });

}

// api/users/signup
exports.signup = (req, res) => {
    db.query('SELECT `id`, `email`, `name` FROM `users` WHERE `email` = "' + req.body.email + '"' , (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            response.status(302, {message: 'User with this email already exists'}, res);
        } else {
            const email = req.body.email,
                  name = req.body.name,
                  secondName = req.body.second_name !== '' ? req.body.second_name : '',
                  salt = bcrypt.genSaltSync(15),
                  password = bcrypt.hashSync(req.body.password, salt);

            const sql = 'INSERT INTO `users`(`name`, `second_name`, `email`, `password`)' +
                        ' VALUES ("' + name + '", "' + secondName + '", "' + email + '", "' + password + '")';

            db.query(sql, (error, results) => {
                if (error) {
                    response.status(400, error, res);
                } else {
                    response.status(200, {message: 'Регистрация прошла успешно!', results}, res);
                }
            });
        }
    }); 
}

exports.signin = (req, res) => {

    db.query('SELECT `id`, `email`, `password` FROM `users` WHERE `email` = "' + req.body.email + '"' , (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if (rows.length <= 0) {
            response.status(401, {message: 'User is not found'}, res);
        } else {
            const row = JSON.parse(JSON.stringify(rows))[0];
            const password = bcrypt.compareSync(req.body.password, row.password);

            if (password) {
                const token = jwt.sign({
                    userId: row.id,
                    email: row.email
                }, 
                config.jwt, {
                    expiresIn: '2h'
                });

                response.status(200, {
                    message: 'User found',
                    token: `Bearer ${token}`
                }, res);
            } else {
                response.status(401, {message: 'Password is not correct'}, res);
            }
        }
    }); 
}