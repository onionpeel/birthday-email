const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'learnjavascriptyes@gmail.com',
    pass: 'closure#'
  }
});

module.exports = {transporter};
