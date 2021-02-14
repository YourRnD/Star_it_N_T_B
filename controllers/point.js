'use strict';

module.exports = ({ router, actions, db }) => {

    const passport = require('passport');

    const response = require('../response');

    const routes = router();
    const point = actions.point({ db });

    //api/point/
    routes.get(
        '/',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            const target = point.getAll();

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

            const target = point.get(req.params.id);

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

            const target = point.add(req.body.payload);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Точка успешно добавлена',
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

            const target = point.delete(req.params.id);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Точка успешно удалена',
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

            const target = point.update(req.params.id, req.body.payload);

            target
                .then(result => {
                    response.status(
                        200,
                        {
                            message: 'Точка успешно обновлена',
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
