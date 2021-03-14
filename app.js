const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const inject = require('require-all');

const db = require('./settings/db');
const config = require('./config');

const app = express();
const router = express.Router;

app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ limit: '3mb', extended: true }));
app.use("/assets", express.static(config.rootPath + '/assets'));
app.use(cors());
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

