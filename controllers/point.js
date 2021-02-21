'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const passport = require('passport');

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

      const target = point.getAll();

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

      const target = point.get(req.params.id);

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
        const reqData = pointValidate.add(req.body.payload);

        point.add(reqData)
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'Точка успешно добавлена',
                result
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

        point.delete(reqData)
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'Точка успешно удалена',
                result
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
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = pointValidate.delete(req.body.payload);

        point.update(req.params.id, reqData)
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'Точка успешно обновлена',
                result
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

  return routes;
}
