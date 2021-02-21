'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const response = require('../common/response');
  const config = require('./../config');

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');
  const jwt = require('jsonwebtoken');

  const routes = router();
  const feedback = actions.feedback({ db });
  const point = actions.point({ db });
  const { feedbackValidate } = validators.feedback;

  //api/point/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      const target = feedback.getAll();

      target
        .then(result => {
          response.status(HttpStatus.OK, result, res);
        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/point/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      const target = feedback.get(req.params.id);

      target
        .then(result => {
          response.status(HttpStatus.OK, result, res);
        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/point/
  routes.post(
    '/',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {

        const reqData = feedbackValidate.add(req.body.payload);

        const token = req.headers.authorization.split('Bearer ').join('');
        const idCustomer = jwt.verify(token, config.jwt).userId;

        point.get(reqData.idPoint)
          .then(result => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such point in the database!'
              }
            }

            feedback.add({
              ...reqData,
              idCustomer,
              date: new Date()
            })
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Review added successfully!',
                    result
                  },
                  res);
              })
              .catch(e => {
                response.status(HttpStatus.BAD_REQUEST, e, res);
              });
          })
          .catch(e => {
            response.status(HttpStatus.BAD_REQUEST, e, res);
          });


      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      }

    }
  );

  //api/point/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = feedbackValidate.delete(+req.params.id);

        const token = req.headers.authorization.split('Bearer ').join('');
        const idCustomer = jwt.verify(token, config.jwt).userId;

        feedback.get(reqData)
          .then(result => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such review in the database!'
              }
            } else if (result.rows[0].idcustomer != idCustomer) {
              throw {
                message: 'You cannot delete reviews of other users!'
              }
            }

            feedback.delete(reqData)
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Review successfully deleted!',
                    result
                  },
                  res);
              })
              .catch(e => {
                response.status(HttpStatus.BAD_REQUEST, e, res);
              });

          })
          .catch(e => {
            response.status(HttpStatus.BAD_REQUEST, e, res);
          });

      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      }

    }
  );

  //api/point/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = feedbackValidate.update(+req.params.id, req.body.payload);

        const token = req.headers.authorization.split('Bearer ').join('');
        const idCustomer = jwt.verify(token, config.jwt).userId;

        feedback.get(reqData)
          .then(result => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such review in the database!'
              }
            } else if (result.rows[0].idcustomer != idCustomer) {
              throw {
                message: 'You cannot delete reviews of other users!'
              }
            }
            point.get(reqData.idPoint)
              .then(result => {

                if (result.rows.length === 0) {
                  throw {
                    message: 'There is no such point in the database!'
                  }
                }

                feedback.update(req.params.id, {
                  ...reqData,
                  idCustomer,
                  date: new Date()
                })
                  .then(result => {
                    response.status(
                      HttpStatus.OK,
                      {
                        message: 'Review successfully updated!',
                        result
                      },
                      res);
                  })
                  .catch(e => {
                    response.status(HttpStatus.BAD_REQUEST, e, res);
                  });
              })
              .catch(e => {
                response.status(HttpStatus.BAD_REQUEST, e, res);
              });
          })
          .catch(e => {
            response.status(HttpStatus.BAD_REQUEST, e, res);
          });

      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      }

    }
  );

  return routes;

}