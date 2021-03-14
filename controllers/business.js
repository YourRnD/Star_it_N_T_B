'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const response = require('../common/response');
  const photo = require('../common/workWithPhotos');

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const routes = router();
  const business = actions.business({ db });
  const { businessValidate } = validators.business;

  //api/business/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = businessValidate.get(req.query);

        business.getAll(reqData.pageNumber * 10)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records found!'
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
            response.status(HttpStatus.BAD_REQUEST, e, res);
          });
      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      }

    }
  )

  //api/business/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = businessValidate.search(req.query);

        business.search(reqData.pageNumber * 10, reqData.value)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records found!'
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
            response.status(HttpStatus.BAD_REQUEST, e, res);
          });
      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      }

    }
  )

  //api/business/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

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
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/business/
  routes.post(
    '/',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    async (req, res) => {
      try {

        const reqData = businessValidate.add(req.body.payload);

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
            response.status(HttpStatus.BAD_REQUEST, e, res);
          });

      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      }

    }
  );

  //api/business/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = businessValidate.delete(req.params.id);

        business.get(reqData)
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
            business.delete(reqData)
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

  //api/business/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    async (req, res) => {
      try {

        const reqData = businessValidate.update(req.params.id, req.body.payload);

        let uploadPath = '';
        if (req.body.payload.image) {
          uploadPath = photo.uploadPhotoFunc({
            ...reqData
          });
        }

        business.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Business with this id does not exist!"
              };
            }
            const oldPath = result.rows[0].path;
            if (photo.checkPuthFunc({ path: oldPath })) {
              if (uploadPath === '') {
                uploadPath = oldPath;
              }
            } else {
              throw {
                message: "The path is incorrect"
              }
            }
            business.update(
              req.params.id,
              {
                ...reqData,
                path: uploadPath,
              }
            )
              .then(result => {
                if (photo.checkPuthFunc({ path: oldPath })) {
                  photo.deletePhotoFunc({ path: oldPath });
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