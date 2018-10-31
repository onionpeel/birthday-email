//Creates an object that is used as an argument in transporter.sendMail().
//This object's properties provide the structure of the email message.
const MailOptions = function (to, name) {
  this.from = process.env.EMAILUSERNAME;
  this.to = to;
  this.subject = `It's your birthday!!!`;
  this.text = `Happy birthday, ${name}!  Hopefully, you receive more birthday greetings than just this one.`;
  this.html = `<p>Hey, ${name}, did you forget your own birthday?  Good thing you set up the Birthday-Email program to remember. Happy Birthday!</p>`;
};

module.exports = MailOptions;
