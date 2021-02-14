'use strict';

module.exports = ({ router, actions, db }) => {

    const response = require('../response');
    const passport = require('passport');

    const routes = router();
    const feedback = actions.feedback({ db });

    //api/point/
    routes.get(
        '/',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = feedback.getAll();

            target
                .then(result => {
                    response.status(200, result, res);
                })
                .catch(e => {
                    response.status(404, e, res);
                });

        }
    )

    //api/point/:id
    routes.get(
        '/:id',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = feedback.get(req.params.id);

            target
                .then(result => {
                    response.status(200, result, res);
                })
                .catch(e => {
                    response.status(404, e, res);
                });

        }
    )

    //api/point/
    routes.post(
        '/',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = feedback.add(req.body.payload);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Отзыв успешно добавлен',
                            result
                        },
                        res);
                })
                .catch(e => {
                    response.status(400, e, res);
                });

        }
    );

    //api/point/
    routes.delete(
        '/:id',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = feedback.delete(req.params.id);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Отзыв успешно удален',
                            result
                        },
                        res);
                })
                .catch(e => {
                    response.status(400, e, res);
                });

        }
    );

    //api/point/
    routes.put(
        '/:id',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = feedback.update(req.params.id, req.body.payload);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Отзыв успешно обновлен',
                            result
                        },
                        res);
                })
                .catch(e => {
                    response.status(400, e, res);
                });

        }
    );

    return routes;

}