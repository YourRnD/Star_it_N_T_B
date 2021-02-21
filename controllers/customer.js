'use strict';

module.exports = ({ router, actions, db, validators }) => {
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const config = require('../config');
  const response = require('../common/response');

  const routes = router();
  const customer = actions.customer({ db });
  const { customerValidate } = validators.customer;

  //api/customer/signup
  routes.post('/signup', (req, res) => {

    try {
      const reqData = customerValidate.add(req.body.payload);

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
                    message: 'Registration completed successfully!'
                  },
                  res);
              })
              .catch(e => {
                response.status(HttpStatus.BAD_REQUEST, e, res);
              });
          }

        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    } catch (e) {
      response.status(HttpStatus.BAD_REQUEST, e, res);
    }



  });

  //api/customer/signin
  routes.get('/signin', (req, res) => {

    customer.getUserByEmail(req.body.payload)
      .then(result => {

        if (result.rows.length <= 0) {
          response.status(
            HttpStatus.BAD_REQUEST,
            {
              message: 'Email or password is incorrect!'
            },
            res
          );
        } else {
          const row = JSON.parse(JSON.stringify(result.rows))[0];
          const password = bcrypt.compareSync(req.body.payload.password, row.password);

          if (password) {
            const token = jwt.sign({
              userId: row.idcustomer
            },
              config.jwt, {
              expiresIn: '2h'
            });

            response.status(
              HttpStatus.OK,
              {
                message: 'User found!',
                token: `Bearer ${token}`
              },
              res
            );
          } else {
            response.status(
              HttpStatus.BAD_REQUEST,
              {
                message: 'Email or password is incorrect!'
              },
              res
            );
          }

        }

      })
      .catch(e => {
        response.status(HttpStatus.BAD_REQUEST, e, res);
      });
  });

  //api/customer/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      const target = customer.getAll();

      target
        .then(result => {
          response.status(HttpStatus.OK, result, res);
        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/customer/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      const target = customer.get(req.params.id);

      target
        .then(result => {
          response.status(HttpStatus.OK, result, res);
        })
        .catch(e => {
          response.status(HttpStatus.BAD_REQUEST, e, res);
        });

    }
  )

  //api/customer/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = customerValidate.delete(req.params.id);

        const target = customer.delete(reqData);

        target
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'User deleted successfully!'
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

  //api/customer/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/login'
    }),
    (req, res) => {

      try {
        const reqData = customerValidate.update(req.params.id, req.body.payload);

        const salt = bcrypt.genSaltSync(15);
        const password = bcrypt.hashSync(reqData.password, salt);
        const target = customer.update(
          req.params.id,
          {
            ...reqData,
            password
          }
        );

        target
          .then(result => {
            response.status(
              HttpStatus.OK,
              {
                message: 'User updated successfully!'
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