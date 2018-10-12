const {Birthday} = require('./../../models/birthday');
const {sendEmailCallback} = require('./sendEmailCallback');
const nodemailer = require('nodemailer');

let findBirthdays = (date) => {
    Birthday.find({date})
        .then(birthdays => {
          birthdays.forEach(sendEmailCallback);
        })
        .catch(e => {
          console.log(e);
        });
};

module.exports = {findBirthdays};
