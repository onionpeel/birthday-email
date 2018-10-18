const {User} = require('./../../models/user');
const {sendEmailCallback} = require('./sendEmailCallback');
const nodemailer = require('nodemailer');

let findBirthdays = (date) => {
  let dateRegex = new RegExp('^\\d{4}-' + date + '$');

  User.find({date: {$regex: dateRegex}})
    .then(users => {
      users.forEach(sendEmailCallback);
    })
    .catch(e => {
      console.log(e);
    });
};

module.exports = {findBirthdays};
