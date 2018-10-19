const nodemailer = require('nodemailer');

//This object is the foundation for configuring and sending emails using
//nodemailer.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'learnjavascriptyes@gmail.com',
    pass: 'closure#'
  }
});

module.exports = {transporter};
