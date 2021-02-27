const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const inject = require('require-all');

const db = require('./settings/db');

const app = express();
const router = express.Router;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
require('./middleware/passport')(passport);

try {
  const controllers = inject({
    dirname: __dirname + '/controllers',
    excludeDirs: '__tests__'
  });
  const actions = inject(__dirname + '/actions');
  const validators = inject(__dirname + '/validators');

  for (const name in controllers) {
    app.use(`/api/${name}`, controllers[name]({ router, actions, db, validators }));
  }

  console.log(controllers);
  console.log(actions);
} catch (e) {
  console.error(e);
}

module.exports = app;

