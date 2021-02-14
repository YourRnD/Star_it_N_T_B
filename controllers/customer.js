'use strict';

module.exports = ({ router, actions, db }) => {
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const passport = require('passport');

    const config = require('../config');
    const response = require('../response');

    const routes = router();
    const customer = actions.customer({ db });

    //api/customer/signup
    routes.post('/signup', (req, res) => {

        customer.getUserByEmail(req.body.payload)
            .then(result => {

                if (result.rows.length > 0) {
                    response.status(
                        200,
                        {
                            message: 'Пользователь с таким email уже существует',
                            result
                        },
                        res
                    );
                } else {
                    const salt = bcrypt.genSaltSync(15);
                    const password = bcrypt.hashSync(req.body.payload.password, salt);

                    customer.add({
                        ...req.body.payload,
                        password
                    })
                        .then(result => {
                            response.status(
                                200,
                                {
                                    message: 'Регистрация прошла успешно!',
                                    result
                                },
                                res);
                        })
                        .catch(e => {
                            response.status(400, e, res);
                        });
                }

            })
            .catch(e => {
                response.status(401, e, res);
            });

    });

    //api/customer/signin
    routes.get('/signin', (req, res) => {

        customer.getUserByEmail(req.body.payload)
            .then(result => {

                if (result.rows.length <= 0) {
                    response.status(
                        401,
                        {
                            message: 'Email или пароль указаны неверно',
                            result
                        },
                        res
                    );
                } else {
                    const row = JSON.parse(JSON.stringify(result.rows))[0];
                    const password = bcrypt.compareSync(req.body.payload.password, row.password);

                    if (password) {
                        const token = jwt.sign({
                            userId: row.id,
                            email: row.email
                        },
                            config.jwt, {
                            expiresIn: '2h'
                        });

                        response.status(
                            200,
                            {
                                message: 'Пользователь найден',
                                token: `Bearer ${token}`
                            },
                            res
                        );
                    } else {
                        response.status(
                            401,
                            {
                                message: 'Email или пароль указаны неверно'
                            },
                            res
                        );
                    }

                }

            })
            .catch(e => {
                response.status(400, e, res);
            });
    });

    //api/customer/
    routes.get(
        '/',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = customer.getAll();

            target
                .then(result => {
                    response.status(200, result, res);
                })
                .catch(e => {
                    response.status(404, e, res);
                });

        }
    )

    //api/customer/:id
    routes.get(
        '/:id',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = customer.get(req.params.id);

            target
                .then(result => {
                    response.status(200, result, res);
                })
                .catch(e => {
                    response.status(404, e, res);
                });

        }
    )

    //api/customer/
    routes.delete(
        '/:id',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = customer.delete(req.params.id);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Пользователь успешно удален',
                            result
                        },
                        res);
                })
                .catch(e => {
                    response.status(400, e, res);
                });

        }
    );

    //api/customer/
    routes.put(
        '/:id',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const salt = bcrypt.genSaltSync(15);
            const password = bcrypt.hashSync(req.body.payload.password, salt);
            const target = customer.update(
                req.params.id,
                {
                    ...req.body.payload,
                    password
                }
            );

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Пользователь успешно обновлен',
                            result
                        },
                        res);
                })
                .catch(e => {
                    console.log(e);
                    response.status(400, e, res);
                });

        }
    );

    return routes;

}