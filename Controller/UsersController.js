'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const response = require('./../response');
const db = require('../settings/db');

// api/users/signup
exports.signup = (req, res) => {
    db.query(
        `SELECT idcustomer, email, name FROM customer
        WHERE email = $1`,
        [req.body.email],
        (error, data) => {
        if(error) {
            response.status(400, error, res);
        } else if (typeof data.rows !== 'undefined' && data.rows.length > 0) {
            response.status(302, {message: 'Пользователь с таким email уже существует'}, res);
        } else {
            const email = req.body.email,
                  name = req.body.name,
                  salt = bcrypt.genSaltSync(15),
                  password = bcrypt.hashSync(req.body.password, salt);

            db.query(
                `INSERT INTO customer(name, email, password)
                VALUES ($1, $2, $3)`,
                [name, email, password],
                (error) => {
                if (error) {
                    response.status(400, error, res);
                } else {
                    response.status(200, {message: 'Регистрация прошла успешно!'}, res);
                }
            });
        }
    }); 
}

// api/users/signin
exports.signin = (req, res) => {

    db.query(
        `SELECT idCustomer, email, password FROM customer
        WHERE email = $1`,
        [req.body.email],
        (error, data) => {
        if(error) {
            response.status(400, error, res);
        } else if (data.rows.length <= 0) {
            response.status(401, {message: 'Email или пароль указаны неверно'}, res);
        } else {
            const row = JSON.parse(JSON.stringify(data.rows))[0];
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
                    message: 'Пользователь найден',
                    token: `Bearer ${token}`
                }, res);
            } else {
                response.status(401, {message: 'Email или пароль указаны неверно'}, res);
            }
        }
    }); 
}