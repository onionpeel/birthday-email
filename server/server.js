require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {task} = require('./cron/cron');
const exphbs = require('express-handlebars');
const path = require('path');
const {createAcknowledgementDate} = require('./utility/createAcknowledgementDate');

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
    let user = new User({
      email: req.body.email,
      date: req.body.date,
      name: req.body.first_name
    });
    user.formatDate();
    user.save().then(user => {
      user.date = createAcknowledgementDate(user);
      res.status(200).render('acknowledgement', user);

    }).catch(err => {
      for (let key in err.errors) {
        if(err.errors[key].value == false) {
          err.errorMessage = `A valid ${key} is required`
        }else if (err.errors[key].value === '-undefined-undefined') {
          err.errorMessage = 'A valid birthdate is required'
        } else {
          let errorMessage = err.errors[key].message;
          err.errorMessage = errorMessage
        }
      };
      res.status(400).render('error', err);
    });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = {app};




// for (let key in err.errors) {
//   if(err.errors[key].value == false) {
//     err.errorMessage = `A valid ${key} is required`
//   } else if (err.errors.date.value === "-undefined-undefined") {
//     err.errorMessage = 'A valid birthdate is required'
//   } else {
//     let errorMessage = err.errors[key].message;
//     err.errorMessage = errorMessage
//   }
// };
