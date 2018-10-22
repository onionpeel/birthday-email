// This is code provided by nodemailer for testing.  It is configured so that
// emails are sent from the account specified in the birthday-email app.  A test
// email is sent to an account at https://ethereal.email/.  A user account was generated
// at that site with the following credentials:
let userName = process.env.TESTMAILUSERNAME
let password = process.env.TESTMAILPASSWORD

// If this account has been timed out, another can be easily created and used to run
// the test for this app.


const nodemailer = require('nodemailer');
const {transporter} = require('./transporter');

let testNodemailer = function() {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAILUSERNAME,
        pass: process.env.EMAILPASSWORD
      }
    });

    let message = {
        from: `The Birthday Greeting App <${process.env.EMAILUSERNAME}>`,
        to: 'zn2b53zns6vqw4dp@ethereal.email',
        subject: 'Birthday notification test email ✔',
        text: 'This is an email sent out by testing the birthday notification app',
        html: '<p><b>Happy Birthday</b> to whomever you are!!!!</p>'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
        console.log('Message sent from: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
}

module.exports = {testNodemailer};
