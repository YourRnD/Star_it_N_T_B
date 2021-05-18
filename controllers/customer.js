'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');
  const bcrypt = require('bcryptjs');

  const response = require('../common/response');
  const getInfoOutToken = require('../common/getUserDateOutToken');

  const routes = router();
  const customer = actions.customer({ db });
  const { customerValidate } = validators.customer;

  //api/customer/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,
    }),
    (req, res) => {
      try {
        const reqData = customerValidate.getAll(req.query);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        if (userData?.rightId != 2) {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        customer.getAll(reqData.pageNumber * 10)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            const users = result.rows.map((item) => {
              return {
                id: item.idcustomer,
                name: item.name,
                email: item.email,
                userStatus: item.idright
              }
            });

            response.status(HttpStatus.OK, {
              message: 'Users find!',
              users,
              countPages: Math.ceil(result.rows[0].count_rows / 10)
            }, res);
          })
          .catch(e => {
            response.status(
              e?.status || HttpStatus.BAD_REQUEST,
              e?.body || e,
              res
            );
          });
      } catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }

    }
  )

  //api/customer/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = customerValidate.search(req.query);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        if (userData?.rightId != 2) {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        customer.search(reqData.pageNumber * 10, reqData.value)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            const users = result.rows.map((item) => {
              return {
                id: item.idcustomer,
                name: item.name,
                email: item.email,
                userStatus: item.idright
              }
            });

            response.status(HttpStatus.OK, {
              message: 'Users find!',
              users,
              countPages: Math.ceil(result.rows[0].count_rows / 10)
            }, res);
          })
          .catch(e => {
            response.status(
              e?.status || HttpStatus.BAD_REQUEST,
              e?.body || e,
              res
            );
          });
      } catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }

    }
  )

  //api/customer/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        customerValidate.get(req.params.id);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        if (userData?.userId != req.params.id) {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        customer
          .get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'User with this id does not exist!'
              };
            }
            response.status(HttpStatus.OK, {
              message: 'User find!',
              user: {
                id: result.rows[0].idcustomer,
                name: result.rows[0].name,
                email: result.rows[0].email
              }
            }, res);
          })
          .catch(e => {
            response.status(
              e?.status || HttpStatus.BAD_REQUEST,
              e?.body || e,
              res
            );
          });
      } catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }

    }
  )

  //api/customer/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
    }),
    (req, res) => {

      try {

        customerValidate.delete(req.params.id);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        if (userData?.rightId != 2) {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        customer.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw { message: 'User with this id does not exist!' };
            }

            customer.delete(req.params.id)
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'User deleted successfully!',
                    user: {
                      id: result.rows[0].idcustomer,
                      name: result.rows[0].name,
                      email: result.rows[0].email
                    }
                  },
                  res);
              })
              .catch(e => {
                response.status(
                  e?.status || HttpStatus.BAD_REQUEST,
                  e?.body || e,
                  res
                );
              });
          })
          .catch(e => {
            response.status(
              e?.status || HttpStatus.BAD_REQUEST,
              e?.body || e,
              res
            );
          });
      } catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }

    }
  );

  //api/customer/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = customerValidate.update(req.params.id, req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        if (userData?.rightId != 2 && userData?.userId != req.params.id) {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        let password = '';

        if (reqData?.password) {

          const salt = bcrypt.genSaltSync(15);
          password = bcrypt.hashSync(reqData.password, salt);

        }

        let status = '';

        if (reqData?.status && userData?.rightId == 2) {

          if (reqData.status != 1 && reqData.status != 2 && reqData.status != 3) {
            throw { message: 'Incorrect status!' };
          }

          status = reqData.status;

        }

        customer.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw { message: 'User with this id does not exist!' };
            }

            const userDate = {
              name: reqData?.name
                ? reqData.name
                : result.rows[0].name,
              email: reqData?.email
                ? reqData.email
                : result.rows[0].email,
              password: reqData?.password
                ? password
                : result.rows[0].password,
              idright: status != ''
                ? status
                : result.rows[0].idright,
            }

            customer.update(
              req.params.id,
              {
                ...userDate
              }
            )
              .then(result => {
                customer.get(result.rows[0].idcustomer)
                  .then(result => {
                    response.status(
                      HttpStatus.OK,
                      {
                        message: 'User updated successfully!',
                        user: {
                          id: result.rows[0].idcustomer,
                          name: result.rows[0].name,
                          email: result.rows[0].email,
                          userStatus: result.rows[0].status_name
                        }
                      },
                      res);
                  })
                  .catch(e => {
                    response.status(
                      e?.status || HttpStatus.BAD_REQUEST,
                      e?.body || e,
                      res
                    );
                  });
              })
              .catch(e => {
                response.status(
                  e?.status || HttpStatus.BAD_REQUEST,
                  e?.body || e,
                  res
                );
              });
          })
          .catch(e => {
            response.status(
              e?.status || HttpStatus.BAD_REQUEST,
              e?.body || e,
              res
            );
          });
      } catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }

    }
  );

  return routes;

}