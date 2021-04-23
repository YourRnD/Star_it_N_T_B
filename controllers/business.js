'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const response = require('../common/response');
  const photo = require('../common/workWithPhotos');
  const getInfoOutToken = require('../common/getUserDateOutToken');

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const routes = router();
  const business = actions.business({ db });
  const manager = actions.manager({ db });
  const { businessValidate } = validators.business;

  //api/business/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = businessValidate.getAll(req.query);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        business.getAll(reqData.pageNumber * 10)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let businesses = result.rows.map((item) => {
              return {
                id: item.idbusiness,
                name: item.name,
                path: item.path,
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Businesses find!',
              businesses,
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

  //api/business/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = businessValidate.search(req.query);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        business.search(reqData.pageNumber * 10, reqData.value)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let businesses = result.rows.map((item) => {
              return {
                id: item.idbusiness,
                name: item.name,
                path: item.path
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Businesses find!',
              businesses,
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

  //api/business/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = businessValidate.get(req.params.id, req.query);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        business.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Business with this id does not exist!"
              };
            }
            response.status(HttpStatus.OK, {
              message: 'Business find!',
              business: {
                id: result.rows[0].idbusiness,
                name: result.rows[0].name,
                path: result.rows[0].path
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

  //api/business/
  routes.post(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    async (req, res) => {
      try {
        const reqData = businessValidate.add(req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
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

        const uploadPath = await photo.uploadPhotoFunc({
          ...reqData
        });

        business.add({
          ...reqData,
          path: uploadPath,
        })
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'Business added successfully!',
                business: {
                  id: result.rows[0].idbusiness,
                  name: result.rows[0].name,
                  path: result.rows[0].path
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

  //api/business/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = businessValidate.delete(req.params.id, req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
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

        business.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Business with this id does not exist!"
              };
            }
            if (!photo.checkPuthFunc({ path: result.rows[0].path })) {
              throw {
                message: "The path is incorrect"
              }
            }
            business.delete(req.params.id)
              .then(result => {
                photo.deletePhotoFunc({ path: result.rows[0].path });
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Business deleted successfully!',
                    business: {
                      id: result.rows[0].idbusiness,
                      name: result.rows[0].name,
                      path: result.rows[0].path
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

  //api/business/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    async (req, res) => {
      try {
        const reqData = businessValidate.update(req.params.id, req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization, reqData.mac);

        if ((userData?.status && userData?.status === 401) || !userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        let uploadPath = '';

        const managerBusiness = await manager.get(userData.userId);

        if (
          (userData?.rightId == 3 && managerBusiness.rows[0]?.idbusiness != req.params.id)
          || (userData?.rightId != 2 && userData?.rightId != 3)
        ) {
          throw {
            status: HttpStatus.FORBIDDEN,
            body: {
              message: 'Not enough rights!'
            }
          }
        }

        business.get(req.params.id)
          .then(async (result) => {
            if (result.rows.length === 0) {
              throw {
                message: "Business with this id does not exist!"
              };
            }

            if (req.body.payload.image) {
              uploadPath = await photo.uploadPhotoFunc({
                ...reqData
              });
            }

            const oldPath = result.rows[0].path;

            const businessDate = {
              name: reqData?.name
                ? reqData.name
                : result.rows[0].name,
              path: req.body.payload?.image
                ? uploadPath
                : oldPath,
            }

            business.update(
              req.params.id,
              {
                ...businessDate
              }
            )
              .then(async (result) => {
                if (
                  result.rows[0].path != oldPath
                  && await photo.checkPuthFunc({ path: oldPath })
                ) {
                  await photo.deletePhotoFunc({ path: oldPath });
                }
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Business updated successfully!',
                    business: {
                      id: result.rows[0].idbusiness,
                      name: result.rows[0].name,
                      path: result.rows[0].path
                    }
                  },
                  res);
              })
              .catch(async (e) => {
                if (await photo.checkPuthFunc({ path: uploadPath })) {
                  await photo.deletePhotoFunc({ path: uploadPath });
                }

                response.status(
                  e?.status || HttpStatus.BAD_REQUEST,
                  e?.body || e,
                  res
                );
              });
          })
          .catch(async (e) => {
            if (await photo.checkPuthFunc({ path: uploadPath })) {
              await photo.deletePhotoFunc({ path: uploadPath });
            }

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