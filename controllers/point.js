'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const response = require('../common/response');
  const getInfoOutToken = require('../common/getUserDateOutToken');

  const routes = router();
  const point = actions.point({ db });
  const manager = actions.manager({ db });
  const business = actions.business({ db });
  const { pointValidate } = validators.point;

  //api/point/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = pointValidate.getAll(req.query);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        point.getAll(reqData.pageNumber * 10)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let points = result.rows.map((item) => {
              return {
                id: item.idpoint,
                name: item.name,
                addres: item.address
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Points find!',
              points,
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

  //api/point/group-by-business
  routes.get(
    '/group-by-business',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = pointValidate.getAllWithBudinessId(req.query);
        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        point.getAllWithBusinessId(reqData.pageNumber * 10, reqData.businessId)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let points = result.rows.map((item) => {
              return {
                id: item.idpoint,
                name: item.name,
                address: item.address
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Points find!',
              points,
              countPages: Math.ceil(result.rows[0].count_rows / 10),
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

  //api/point/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = pointValidate.search(req.query);

        const userData = getInfoOutToken(req.headers.authorization);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        point.search(reqData.pageNumber * 10, reqData.value)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let points = result.rows.map((item) => {
              return {
                id: item.idpoint,
                name: item.name,
                addres: item.address
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Points find!',
              points,
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

  //api/point/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        pointValidate.get(req.params.id);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        point.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Point with this id does not exist!"
              };
            }
            let point = {
              id: result.rows[0].idpoint,
              name: result.rows[0].name,
              address: result.rows[0].address
            }
            business.get(result.rows[0].idbusiness).then(result => {
              if (result.rows.length === 0) {
                throw {
                  message: "Point with this id does not exist!"
                };
              }
              point.businessName = result.rows[0].name;
              point.path = result.rows[0].path;
              response.status(HttpStatus.OK, {
                message: 'Point find!',
                point
              }, res);
            }).catch(e => {
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
  )

  //api/point/
  routes.post(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    async (req, res) => {

      try {
        const reqData = pointValidate.add(req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        let safeUserDate = {};

        if (userData?.rightId == 2) {
          if (!reqData?.businessId) {
            throw {
              message: "Business id not specified"
            }
          }

          safeUserDate.idbusiness = reqData?.businessId;
        } else if (userData?.rightId == 3) {

          const managerBusiness = await manager.get(userData.userId);

          if (managerBusiness?.rows[0]?.idbusiness) {
            safeUserDate.idbusiness = managerBusiness?.rows[0]?.idbusiness;
          } else {
            throw {
              message: "Business id not specified"
            }
          }
        } else {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        safeUserDate = {
          ...safeUserDate,
          name: reqData.name,
          address: reqData.address
        };

        point.add(safeUserDate)
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'Point added successfully!',
                point: {
                  id: result.rows[0].idpoint,
                  name: result.rows[0].name,
                  addres: result.rows[0].address
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

  //api/point/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        pointValidate.delete(req.params.id);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        point.get(req.params.id)
          .then(async (result) => {
            if (result.rows.length === 0) {
              throw {
                message: "Point with this id does not exist!"
              };
            }

            const managerBusiness = await manager.get(userData.userId);

            if (
              (userData?.rightId == 3 && managerBusiness.rows[0]?.idbusiness != result.rows[0]?.idbusiness)
              || userData?.rightId != 2
            ) {
              throw {
                status: HttpStatus.FORBIDDEN,
                body: {
                  message: 'Not enough rights!'
                }
              }
            }

            point.delete(req.params.id)
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Point deleted successfully!',
                    point: {
                      id: result.rows[0].idpoint,
                      name: result.rows[0].name,
                      addres: result.rows[0].address
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

  //api/point/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = pointValidate.update(req.params.id, req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        point.get(req.params.id)
          .then(async (result) => {
            if (result.rows.length === 0) {
              throw {
                message: "Point with this id does not exist!"
              };
            }

            let safeUserDate = {};

            if (userData?.rightId == 3) {
              const managerBusiness = await manager.get(userData.userId);

              if (managerBusiness?.rows[0]?.idbusiness) {
                safeUserDate.idbusiness = managerBusiness?.rows[0]?.idbusiness;
              } else {
                throw {
                  message: "Business id not specified"
                }
              }

            } else if (userData?.rightId == 2) {
              safeUserDate.idbusiness = reqData?.businessId
                ? reqData.businessId
                : result.rows[0].idbusiness;
            } else {
              throw {
                status: HttpStatus.FORBIDDEN,
                body: {
                  message: 'Not enough rights!'
                }
              }
            }

            safeUserDate = {
              ...safeUserDate,
              name: reqData?.name
                ? reqData.name
                : result.rows[0].name,
              address: reqData?.address
                ? reqData.address
                : result.rows[0].address,
            };

            point.update(req.params.id, safeUserDate)
              .then(result => {
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Point updated successfully!',
                    point: {
                      id: result.rows[0].idpoint,
                      name: result.rows[0].name,
                      addres: result.rows[0].address
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
