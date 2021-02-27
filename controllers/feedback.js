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

  //api/feedback/
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
          let feedback = result.rows.map((item) => {
            return {
              id: item.idfeedback,
              date: item.date,
              notes: item.notes,
              rating: item.rating,
              user: {
                id: item.idcustomer,
                name: item.name,
                email: item.email
              },
              point: {
                id: item.idpoint,
                name: item.name,
                addres: item.address
              }
            }
          });
          response.status(HttpStatus.OK, {
            message: 'Feedback find!',
            feedback
          }, res);
        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/feedback/:id
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
          if (result.rows.length === 0) {
            throw {
              message: "Feedback with this id does not exist!"
            };
          }
          response.status(HttpStatus.OK, {
            message: 'Feedback find!',
            feedback: {
              id: result.rows[0].idfeedback,
              date: result.rows[0].date,
              notes: result.rows[0].notes,
              rating: result.rows[0].rating,
              user: {
                id: result.rows[0].idcustomer,
                name: result.rows[0].name,
                email: result.rows[0].email
              },
              point: {
                id: result.rows[0].idpoint,
                name: result.rows[0].name,
                addres: result.rows[0].address
              }
            }
          }, res);
        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/feedback/
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
                    feedback: {
                      id: result.rows[0].idfeedback,
                      date: result.rows[0].date,
                      notes: result.rows[0].notes,
                      rating: result.rows[0].rating,
                      user: {
                        id: result.rows[0].idcustomer,
                        name: result.rows[0].name,
                        email: result.rows[0].email
                      },
                      point: {
                        id: result.rows[0].idpoint,
                        name: result.rows[0].name,
                        addres: result.rows[0].address
                      }
                    }
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

  //api/feedback/
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
                    feedback: {
                      id: result.rows[0].idfeedback,
                      date: result.rows[0].date,
                      notes: result.rows[0].notes,
                      rating: result.rows[0].rating,
                      user: {
                        id: result.rows[0].idcustomer,
                        name: result.rows[0].name,
                        email: result.rows[0].email
                      },
                      point: {
                        id: result.rows[0].idpoint,
                        name: result.rows[0].name,
                        addres: result.rows[0].address
                      }
                    }
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

  //api/feedback/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = feedbackValidate.update(req.params.id, req.body.payload);

        const token = req.headers.authorization.split('Bearer ').join('');
        const idCustomer = jwt.verify(token, config.jwt).userId;

        feedback.get(req.params.id)
          .then(result => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such review in the database!'
              }
            } else if (result.rows[0].idcustomer != idCustomer) {
              throw {
                message: 'You cannot change reviews of other users!'
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
                        feedback: {
                          id: result.rows[0].idfeedback,
                          date: result.rows[0].date,
                          notes: result.rows[0].notes,
                          rating: result.rows[0].rating,
                          user: {
                            id: result.rows[0].idcustomer,
                            name: result.rows[0].name,
                            email: result.rows[0].email
                          },
                          point: {
                            id: result.rows[0].idpoint,
                            name: result.rows[0].name,
                            addres: result.rows[0].address
                          }
                        }
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