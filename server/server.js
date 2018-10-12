require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Birthday} = require('./models/birthday');
const {task} = require('./cron/cron');

let app = express();
let port = process.env.PORT || 3000;
app.use(bodyParser.json());

task.start();

app.get('/birthdays', (req, res) => {
    Birthday.find((err, birthdays) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(birthdays);
    });
});

app.post('/birthday', (req, res) => {
  let birthday = new Birthday({
    email: req.body.email,
    date: req.body.date
  });

  birthday.save().then(birthday => {
    res.status(200).send(birthday);
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = {app};
