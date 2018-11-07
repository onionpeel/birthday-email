const {User} = require('./../../models/user');
const {sendEmailCallback} = require('./sendEmailCallback');
const nodemailer = require('nodemailer');
/*
This takes a string input from dateToday() and uses that to create a regex.
This regex is used to search the User collection, and the results are stored in
a "users" array. Each "user" from this "users" array will have a birthday sendEmailCallback
sent to it.
*/

let findBirthdaysSendEmail = (date) => {
  let dateRegex = new RegExp('^\\d{4}-' + date + '$');

  User.find({date: {$regex: dateRegex}})
    .then(users => {
      users.forEach(sendEmailCallback);
    })
    .catch(e => {
      console.log(e);
    });
};

module.exports = {findBirthdaysSendEmail};
