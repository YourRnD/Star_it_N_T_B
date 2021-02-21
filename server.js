const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const inject = require('require-all');

const db = require('./settings/db');

const app = express();
const router = express.Router;
const port = process.env.PORT || 3500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
require('./middleware/passport')(passport);

try {
  const controllers = inject(__dirname + '/controllers');
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

app.listen(port, () => {
  console.log(`Сервер запущен на порте ${port}`);
});