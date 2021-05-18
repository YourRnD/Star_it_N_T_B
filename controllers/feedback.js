'use strict';

module.exports = ({ router, actions, db, validators }) => {

  const response = require('../common/response');
  const photo = require('../common/workWithPhotos');
  const getInfoOutToken = require('../common/getUserDateOutToken');

  const passport = require('passport');
  const HttpStatus = require('http-status-codes');

  const routes = router();
  const feedback = actions.feedback({ db });
  const point = actions.point({ db });
  const manager = actions.manager({ db });

  const { feedbackValidate } = validators.feedback;

  //api/feedback/
  routes.get(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = feedbackValidate.getAll(req.query);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        feedback.getAll(reqData.pageNumber * 10)
          .then(result => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }
            let feedback = result.rows.map((item) => {
              return {
                id: item.idfeedback,
                date: item.date,
                notes: item.notes,
                rating: item.rating,
                path: result.rows[0].path,
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
              feedback,
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

  //api/feedback/search
  routes.get(
    '/search',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = feedbackValidate.search(req.query);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        feedback.search(reqData.pageNumber * 10, reqData.value)
          .then(async (result) => {
            if (result.rows.length === 0) {
              throw {
                message: 'No records find!'
              }
            }

            if (userData?.rightId != 2) {
              const managerBusiness = await manager.get(userData.userId);

              if (
                userData?.rightId != 3
                || (
                  userData?.rightId == 3
                  && managerBusiness.rows[0]?.idbusiness != result.rows[0].idbusiness
                )
              ) {
                throw {
                  status: HttpStatus.FORBIDDEN,
                  body: {
                    message: ' '
                  }
                }
              }

            }

            let feedback = result.rows.map((item) => {
              return {
                id: item.idfeedback,
                date: item.date,
                notes: item.notes,
                rating: item.rating,
                path: result.rows[0].path,
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
              feedback,
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

  //api/feedback/:id
  routes.get(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        feedbackValidate.get(req.params.id);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        feedback.get(req.params.id)
          .then(async (result) => {
            if (result.rows.length === 0) {
              throw {
                message: "Feedback with this id does not exist!"
              };
            }

            if (userData?.rightId != 2) {
              const managerBusiness = await manager.get(userData.userId);

              if (
                userData?.rightId == 3
                && managerBusiness.rows[0]?.idbusiness != result.rows[0].idbusiness
              ) {
                throw {
                  status: HttpStatus.FORBIDDEN,
                  body: {
                    message: 'Not enough rights!'
                  }
                }
              }

              if (
                userData?.rightId == 1
                && userData.userId != result.rows[0].idcustomer
              ) {
                throw {
                  status: HttpStatus.FORBIDDEN,
                  body: {
                    message: 'Not enough rights!'
                  }
                }
              }
            }

            response.status(HttpStatus.OK, {
              message: 'Feedback find!',
              feedback: {
                id: result.rows[0].idfeedback,
                date: result.rows[0].date,
                notes: result.rows[0].notes,
                rating: result.rows[0].rating,
                path: result.rows[0].path,
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

  //api/feedback/
  routes.post(
    '/',
    passport.authenticate('jwt', {
      session: false,

    }),
    async (req, res) => {

      try {
        const reqData = feedbackValidate.add(req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        let uploadPath = [];

        if (req.body.payload?.image) {
          uploadPath = await photo.uploadPhotoFunc({
            ...reqData
          });
        }

        point.get(reqData.idPoint)
          .then(result => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such point in the database!'
              }
            }

            feedback.add({
              ...reqData,
              idCustomer: userData.userId,
              date: new Date(),
              path: uploadPath,
            }).then(result => {
              response.status(
                HttpStatus.OK,
                {
                  message: 'Review added successfully!',
                  feedback: {
                    id: result.rows[0].idfeedback,
                    date: result.rows[0].date,
                    notes: result.rows[0].notes,
                    rating: result.rows[0].rating,
                    path: result.rows[0].path,
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

  //api/feedback/
  routes.delete(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {

        feedbackValidate.delete(req.params.id);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        feedback.get(req.params.id)
          .then(result => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such review in the database!'
              }
            }

            if (userData?.rightId != 2) {
              if (result.rows[0].idcustomer != userData.userId) {
                throw {
                  status: HttpStatus.FORBIDDEN,
                  body: {
                    message: 'Not enough rights!'
                  }
                }
              }
            }

            if (
              result.rows[0].path != 'false'
              && !photo.checkPuthFunc({ paths: result.rows[0].path })
            ) {
              throw {
                message: "The path is incorrect"
              }
            }

            feedback.delete(req.params.id)
              .then(result => {
                if (result.rows[0].path != 'false') {
                  photo.deletePhotoFunc({ paths: result.rows[0].path });
                }
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Review successfully deleted!',
                    feedback: {
                      id: result.rows[0].idfeedback,
                      date: result.rows[0].date,
                      notes: result.rows[0].notes,
                      rating: result.rows[0].rating,
                      path: result.rows[0].path,
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

  //api/feedback/
  routes.put(
    '/:id',
    passport.authenticate('jwt', {
      session: false,

    }),
    (req, res) => {

      try {
        const reqData = feedbackValidate.update(req.params.id, req.body.payload);

        const userData = getInfoOutToken(req.headers.authorization);

        if (!userData?.rightId) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            body: {
              message: 'Fatal error, please log in again'
            }
          }
        }

        feedback.get(req.params.id)
          .then(async (result) => {

            if (result.rows.length === 0) {
              throw {
                message: 'There is no such review in the database!'
              }
            }

            if (userData?.rightId != 2) {
              if (result.rows[0].idcustomer != userData.userId) {
                throw {
                  status: HttpStatus.FORBIDDEN,
                  body: {
                    message: 'Not enough rights!'
                  }
                }
              }
            }

            const oldPath = result.rows[0].path;

            console.log(oldPath)

            if (
              oldPath != []
              && !(await photo.checkPuthFunc({ paths: oldPath }))
            ) {
              throw {
                message: "The path is incorrect"
              }
            }

            let uploadPath = '';
            if (req.body.payload.image) {
              uploadPath = await photo.uploadPhotoFunc({
                ...reqData
              });
            }

            const feedbackDate = {
              notes: reqData?.notes
                ? reqData.notes
                : result.rows[0].notes,
              rating: reqData?.rating
                ? reqData.rating
                : result.rows[0].rating,
              idPoint: reqData?.idPoint
                ? reqData.idPoint
                : result.rows[0].idpoint,
              path: req.body.payload?.image
                ? uploadPath
                : oldPath,
            }

            const checkPoint = await point.get(feedbackDate.idPoint);

            if (!checkPoint?.rows?.length || checkPoint?.rows?.length == 0) {
              throw {
                message: 'There is no such point in the database!'
              }
            }

            feedback.update(req.params.id, {
              ...feedbackDate,
              idCustomer: userData.userId,
              date: new Date()
            })
              .then(result => {
                if (photo.checkPuthFunc({ paths: oldPath })) {
                  photo.deletePhotoFunc({ paths: oldPath });
                }
                response.status(
                  HttpStatus.OK,
                  {
                    message: 'Review successfully updated!',
                    feedback: {
                      id: result.rows[0].idfeedback,
                      date: result.rows[0].date,
                      notes: result.rows[0].notes,
                      rating: result.rows[0].rating,
                      path: result.rows[0].path,
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