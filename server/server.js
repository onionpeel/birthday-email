require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {task} = require('./cron/cron');
const exphbs = require('express-handlebars');
const path = require('path');
const {createAcknowledgementDate} = require('./utility/createAcknowledgementDate');
const {saveUser} = require('./middleware/saveUser');

let app = express();
let port = process.env.PORT;
app.use(bodyParser.json());
let urlEncodedParser = bodyParser.urlencoded({extended: false});
const {renderHomePage} = require('./middleware/renderHomePage');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Start the cron job
task.start();

//Home page of the project
app.get('/', renderHomePage);

//Create a new user based on client input
app.post('/', urlEncodedParser, async (req, res) => {
  //The 'user' object will either be the object that is sent back from the
  //database or it will be an error object.  If it is an error object, it is
  //handled in the 'else' block and is renamed, 'err'.
  let user = await saveUser(req, res);
  //Send the client an acknowledgement that a birthday email will be sent
  //based on the arguments provided by the client
  if(!user.errors) {
    res.status(200).render('acknowledgement', user);
  //If the attempt to set up the birthday email fails, send back a message to
  //the client explaining why the arguments were invalid.
  } else {
    let err = user;
    //The error message to be rendered is based on the error object.
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
  };
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = {app};
