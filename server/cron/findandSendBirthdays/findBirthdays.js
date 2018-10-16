const {User} = require('./../../models/user');
const {sendEmailCallback} = require('./sendEmailCallback');
const nodemailer = require('nodemailer');

let findBirthdays = (date) => {
    User.find({date})
        .then(users => {
          users.forEach(sendEmailCallback);
        })
        .catch(e => {
          console.log(e);
        });
};

module.exports = {findBirthdays};
