module.exports = ({ router, actions, db, validators }) => {

  const bcrypt = require('bcryptjs');
  const passport = require('passport');
  const HttpStatus = require('http-status-codes');
  const jwt = require('jsonwebtoken');

  const config = require('../config');
  const response = require('../common/response');
  const getInfoOutToken = require('../common/getUserDateOutToken');

  const routes = router();
  const customer = actions.customer({ db });
  const manager = actions.manager({ db });
  const { authValidate } = validators.auth;

  //api/auth/signup
  routes.post('/signup', (req, res) => {

    try {
      const reqData = authValidate.add(req.body.payload);

      customer.getUserByEmail(reqData)
        .then(result => {

          if (result.rows.length > 0) {
            throw {
              message: "This mail is already in use!"
            };
          } else {
            const salt = bcrypt.genSaltSync(15);
            const password = bcrypt.hashSync(reqData.password, salt);

            customer.add({
              ...reqData,
              password
            })
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Registration completed successfully!',
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
          }

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
  });

  //api/auth/signin
  routes.get('/signin', (req, res) => {
    try {
      const reqData = authValidate.get(req.query);

      customer.getUserByEmail(reqData)
        .then(async (result) => {

          if (result.rows.length <= 0) {
            throw {
              message: 'Email or password is incorrect!'
            };
          } else {

            const row = JSON.parse(JSON.stringify(result.rows))[0];
            const password = bcrypt.compareSync(req.query.password, row.password);

            if (password) {
              const accessToken = jwt.sign({
                userId: row.idcustomer,
                rightId: row.idright,
                mac: reqData.mac,
              },
                config.jwt, {
                expiresIn: '1h'
              });
              const refreshToken = jwt.sign({
                userId: row.idcustomer,
                mac: reqData.mac,
              },
                config.jwt, {
                expiresIn: 60 * 60 * 24
              });

              const user = {
                id: result.rows[0].idcustomer,
                name: result.rows[0].name,
                email: result.rows[0].email,
                userStatus: result.rows[0].status_name
              }

              if (result.rows[0].status_name === 'manager') {
                const business = await manager.get(result.rows[0].idcustomer);

                business?.rows[0]?.idbusiness
                  ? user.business = business?.rows[0]?.idbusiness
                  : null;
              }

              response.status(
                HttpStatus.OK,
                {
                  message: 'User find!',
                  accessToken: `Bearer ${accessToken}`,
                  refreshToken: `Bearer ${refreshToken}`,
                  user
                },
                res
              );
            } else {
              throw {
                message: 'Email or password is incorrect!'
              };
            }

          }

        })
        .catch(e => {
          response.status(
            e?.status || HttpStatus.BAD_REQUEST,
            e?.body || e,
            res
          );
        });
    }
    catch (e) {
      response.status(
        e?.status || HttpStatus.BAD_REQUEST,
        e?.body || e,
        res
      );
    }
  });

  //api/auth/refresh
  routes.get(
    '/refresh',
    (req, res) => {

      try {
        const reqData = authValidate.refresh(req.query);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if (userData?.status && userData?.status === 401) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        customer
          .get(userData.userId)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                status: HttpStatus.UNAUTHORIZED,
                body: {
                  message: 'Fatal error, please log in again'
                }
              }
            }
            const accessToken = jwt.sign({
              userId: result.rows[0].idcustomer,
              rightId: result.rows[0].idright,
              mac: reqData.mac,
            },
              config.jwt, {
              expiresIn: '2h'
            });
            const refreshToken = jwt.sign({
              userId: result.rows[0].idcustomer,
              mac: reqData.mac,
            },
              config.jwt, {
              expiresIn: 60 * 60 * 24
            });
            response.status(HttpStatus.OK, {
              message: 'Token updated!',
              accessToken: `Bearer ${accessToken}`,
              refreshToken: `Bearer ${refreshToken}`
            }, res);
          })
          .catch(e => {
            response.status(
              e?.status || HttpStatus.BAD_REQUEST,
              e?.body || e,
              res
            );
          });
      }
      catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }
    });

  //api/auth/me
  routes.get(
    '/me',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {
      try {
        const reqData = authValidate.me(req.query);

        userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if (!userData?.userId || (userData?.status && userData?.status === 401)) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        customer
          .get(userData.userId)
          .then(async (result) => {
            if (result.rows.length === 0) {
              throw {
                status: HttpStatus.UNAUTHORIZED,
                body: {
                  message: 'Fatal error, please log in again'
                }
              }
            }

            const user = {
              id: result.rows[0].idcustomer,
              name: result.rows[0].name,
              email: result.rows[0].email,
              userStatus: result.rows[0].status_name
            }

            if (result.rows[0].status_name === 'manager') {
              const business = await manager.get(result.rows[0].idcustomer);

              business?.rows[0]?.idbusiness
                ? user.business = business?.rows[0]?.idbusiness
                : null;
            }

            response.status(HttpStatus.OK, {
              message: 'User find!',
              user
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

  return routes;

};