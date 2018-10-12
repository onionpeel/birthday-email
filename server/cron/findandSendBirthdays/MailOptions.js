const MailOptions = function (to) {
  this.from = `learnjavascriptyes@gmail.com`;
  this.to = to;
  this.subject = `Test`;
  this.text = `This is a test`;
};

module.exports = {MailOptions};
