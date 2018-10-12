let {MailOptions} = require('./MailOptions');
const {transporter} = require('./transporter');

let sendEmailCallback = birthday => {
  let mailTo = birthday.email;
  let mailOptions = new MailOptions(mailTo);
  transporter.sendMail(mailOptions, function(err) {
    if (err) {
      console.error('there was an error: ', err);
    }
  });
}

module.exports = {sendEmailCallback};
