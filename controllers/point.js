'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const response = require('../common/response');

  const routes = router();
  const point = actions.point({ db });
  const { pointValidate } = validators.point;

  //api/point/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = pointValidate.get(req.query);

        point.getAll(reqData.pageNumber * 5)
          .then(result => {
            let points = result.rows.map((item) => {
              return {
                id: item.idpoint,
                name: item.name,
                addres: item.address
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Points find!',
              points
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

  //api/point/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = pointValidate.search(req.query);

        point.search(reqData.pageNumber * 5, reqData.value)
          .then(result => {
            let points = result.rows.map((item) => {
              return {
                id: item.idpoint,
                name: item.name,
                addres: item.address
              }
            });
            response.status(HttpStatus.OK, {
              message: 'Points find!',
              points
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

  //api/point/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      point.get(req.params.id)
        .then(result => {
          if (result.rows.length === 0) {
            throw {
              message: "Point with this id does not exist!"
            };
          }
          response.status(HttpStatus.OK, {
            message: 'Point find!',
            point: {
              id: result.rows[0].idpoint,
              name: result.rows[0].name,
              addres: result.rows[0].address
            }
          }, res);
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
        const reqData = pointValidate.add(req.body.payload);

        point.add(reqData)
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
        const reqData = pointValidate.delete(req.params.id);

        point.get(reqData)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Point with this id does not exist!"
              };
            }

            point.delete(reqData)
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
        const reqData = pointValidate.update(req.params.id, req.body.payload);

        point.get(req.params.id)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: "Point with this id does not exist!"
              };
            }

            point.update(req.params.id, reqData)
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
