const {User} = require('./../../models/user');
const {sendEmailCallback} = require('./sendEmailCallback');
const nodemailer = require('nodemailer');

//This takes a string input from dateToday() and uses that to create a regex.
//This regex is used to search the User collection, and the results are stored in
//a "users" array. Each "user" from this "users" array will have a birthday sendEmailCallback
//sent to it.

// let findBirthdaysSendEmailObject = {
//   let findBirthdaysSendEmail = (date) => {
//     let dateRegex = new RegExp('^\\d{4}-' + date + '$');
//
//     User.find({date: {$regex: dateRegex}})
//       .then(users => {
//         users.forEach(sendEmailCallback);
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };
// };

//This function is set in an object in order that it can be stubbed in the
//tests.  Stubbing with Sinon requires that wrapper stubs reference the target
//function and the object on which that function resides.  If not for this
//stubbing, there would be no need to put findBirthdaysSendEmail() in an object.
// let findBirthdaysSendEmailObject = {
//   findBirthdaysSendEmail(date) {
//     let dateRegex = new RegExp('^\\d{4}-' + date + '$');
//
//     User.find({date: {$regex: dateRegex}})
//       .then(users => {
//         users.forEach(sendEmailCallback);
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   }
// };
//
// module.exports = findBirthdaysSendEmailObject;


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

// let findBirthdaysSendEmail = () => {
//   console.log('verrrrrrryyyyy baaaaaaaaaaaaaad');
//
// };

module.exports = findBirthdaysSendEmail;
