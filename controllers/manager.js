'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const response = require('../common/response');
  const getInfoOutToken = require('../common/getUserDateOutToken');

  const routes = router();
  const manager = actions.manager({ db });
  const { managerValidate } = validators.manager;

  //api/manager/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = managerValidate.getAll(req.query);

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

        manager.getAll(reqData.pageNumber * 10)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let managers = result.rows.map((item) => {
              return {
                idmanager: item.idmanager,
                idcustomer: item.idcustomer,
                name: item.name,
                email: item.email,
                idbusiness: item.idbusiness
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Managers find!',
              managers,
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

  //api/manager/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = managerValidate.search(req.query);

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

        manager.search(reqData.pageNumber * 10, reqData.value)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let managers = result.rows.map((item) => {
              return {
                idmanager: item.idmanager,
                idcustomer: item.idcustomer,
                name: item.name,
                email: item.email,
                idbusiness: item.idbusiness
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Managers find!',
              managers,
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

  //api/manager/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        managerValidate.get(req.params.id);

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

        manager.getWithManagerId(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Manager with this id does not exist!"
              };
            }
            response.status(HttpStatus.OK, {
              message: 'Manager find!',
              manager: {
                idmanager: result.rows[0].idmanager,
                idcustomer: result.rows[0].idcustomer,
                name: result.rows[0].name,
                email: result.rows[0].email,
                idbusiness: result.rows[0].idbusiness
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

  //api/manager/
  routes.post(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = managerValidate.add(req.body.payload);

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

        manager.add({ ...reqData })
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'Manager added successfully!',
                manager: {
                  idmanager: result.rows[0].idmanager,
                  idcustomer: result.rows[0].idcustomer
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
      } catch (e) {
        response.status(
          e?.status || HttpStatus.BAD_REQUEST,
          e?.body || e,
          res
        );
      }

    }
  );

  //api/manager/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        managerValidate.delete(req.params.id);

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

        manager.getWithManagerId(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Manager with this id does not exist!"
              };
            }

            manager.delete(req.params.id)
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Manager deleted successfully!',
                    manager: {
                      idmanager: result.rows[0].idmanager,
                      idcustomer: result.rows[0].idcustomer,
                      name: result.rows[0].name,
                      email: result.rows[0].email,
                      idbusiness: result.rows[0].idbusiness
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

  //api/manager/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = managerValidate.update(req.params.id, req.body.payload);

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

        manager.getWithManagerId(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Manager with this id does not exist!"
              };
            }

            manager.update(req.params.id, {
              idCustomer: reqData?.customerId
                ? reqData.customerId
                : result.rows[0].idcustomer,
              idBusiness: reqData?.businessId
                ? reqData.businessId
                : result.rows[0].idbusiness,
            })
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Manager updated successfully!',
                    manager: {
                      idmanager: result.rows[0].idmanager,
                      idcustomer: result.rows[0].idcustomer,
                      name: result.rows[0].name,
                      email: result.rows[0].email,
                      idbusiness: result.rows[0].idbusiness
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

  return routes;
}
