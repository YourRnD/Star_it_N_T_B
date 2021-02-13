'use strict';

module.exports = (router) => {
    
    const passport = require('passport');

    const response = require('../response');
    const db = require('../settings/db');
    
    const routes = router();

    //api/point/
    routes.get(
        '/',
        passport.authenticate('jwt', {
            session: false
        }),
        (req, res) => {

            db.query(
                `SELECT idPoint, name, address FROM point`,
                (error, data) => {
                if (error) {
                    response.status(404, error, res);
                } else {
                    response.status(200, data.rows, res)
                }
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

            db.query(
                `SELECT idPoint, name, address FROM point
                WHERE idPoint = $1`,
                [req.params.id],
                (error, data) => {
                if (error) {
                    response.status(404, error, res);
                } else {
                    response.status(200, data.rows, res)
                }
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
            
            //db -- start
            db.query(
                `SELECT idpoint, name, address FROM point
                WHERE name = $1 AND address = $2`,
                [req.body.name, req.body.address],
                (error, data) => {
                if(error) {
                    response.status(400, error, res);
                } else if (typeof data.rows !== 'undefined' && data.rows.length > 0) {
                    response.status(302, {message: 'Такая точка уже есть в базе'}, res);
                } else {
                    const address = req.body.address,
                          name = req.body.name;
        
                    db.query(
                        `INSERT INTO point(name, address)
                        VALUES ($1, $2)`,
                        [name, address],
                        (error) => {
                        if (error) {
                            response.status(400, error, res);
                        } else {
                            response.status(200, {message: 'Точка успешно добавлена'}, res);
                        }
                    });
                }
            }); 
            //db -- end
        }
    );

    return routes;
}
