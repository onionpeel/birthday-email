let MailOptions = require('./MailOptions');
const {transporter} = require('./transporter');

//This is a callback function used in findBirthdaysSendEmail() and is invoked for
//each user that has a birthdate which matches the desired date.

let sendEmailCallback = user => {
  let mailTo = user.email;
  let mailName = user.name;
  let mailOptions = new MailOptions(mailTo, mailName);
  transporter.sendMail(mailOptions)
  .then(info => {
    console.log('Mail received by: ', info.accepted);
  })
  .catch(e => {
    console.log(e);
  });
}

module.exports = sendEmailCallback;
