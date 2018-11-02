const nodemailer = require('nodemailer');

//This object is the foundation for configuring and sending emails using
//nodemailer.

let argObj = {
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAILUSERNAME,
    pass: process.env.EMAILPASSWORD
  }
};

const transporter = nodemailer.createTransport(argObj);

module.exports = {transporter, argObj};
