require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {task} = require('./cron/cron');
const exphbs = require('express-handlebars');
const path = require('path');

let app = express();
let port = process.env.PORT || 3000;
app.use(bodyParser.json());

let urlEncodedParser = bodyParser.urlencoded({extended: false});
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// task.start();

app.get('/', (req, res) => {
  res.render('home', {title: 'Birthday Email'})
});

app.post('/', urlEncodedParser, (req, res) => {
    // let jsonBody = req.body;
    // let body = JSON.stringify(jsonBody);
    // res.render('acknowledgement', {body});

    // let notification = JSON.stringify(req.body);
    // res.render('acknowledgement', {notification});
    console.log(req.body.date)

    let user = new User({
      email: req.body.email,
      date: req.body.date
    });

    console.log(user)

    user.formatDate();

    console.log(user)

    user.save().then(greeting => {
      res.status(200).send(greeting);
    }).catch(err => {
      res.status(400).send(err);
    });

    // res.render('acknowledgement');

});

// app.get('/birthdays', (req, res) => {
//     Birthday.find((err, birthdays) => {
//       if (err) {
//         return res.status(500).send(err);
//       }
//       return res.status(200).send(birthdays);
//     });
// });
//
// app.post('/birthday', (req, res) => {
//   let birthday = new Birthday({
//     email: req.body.email,
//     date: req.body.date
//   });
//
//   birthday.save().then(birthday => {
//     res.status(200).send(birthday);
//   }).catch(err => {
//     res.status(400).send(err);
//   });
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = {app};
