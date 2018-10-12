// const expect = require('expect');
const request = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const {app} = require('./../server');
const {Birthday} = require('./../models/birthday');
const {findBirthdays} = require('./../cron/findandSendBirthdays/findBirthdays');
const {MailOptions} = require('./../cron/findandSendBirthdays/MailOptions');
const {sendEmailCallback} = require('./../cron/findandSendBirthdays/sendEmailCallback');
const {testNodemailer} = require('./../cron/findandSendBirthdays/testNodemailer');
const {transporter} = require('./../cron/findandSendBirthdays/transporter');
const {dateToday} = require('./../utilities/dateToday');
const {bday, populateBday} = require('./seed/seed');
const {task} = require('./../cron/cron');

beforeEach(populateBday);

describe('ROUTES', () => {
  describe('POST/birthday', () => {
    it('should add a new birthday object in the database', (done) => {
      let bday = new Birthday({
        email: "jeb.mail.com",
        date: "11/11"
      });

      request(app)
        .post('/birthday')
        .send(bday)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).to.be.eql(bday.email);
          expect(res.body.date).to.be.eql(bday.date);
        })
        .end(done);
    });
  });

  describe('GET/birthdays', () => {
    it('should return all of the birthday objects', done => {
      request(app)
        .get('/')
        .expect(200)
        .end(done)
    });
  });
});

describe('FindBirthdays Module', () => {
  describe('MailOptions()', () => {
    it('should return a mailOptions object', () => {
      let testTo = `learnjavascriptyes@gmail.com`;
      let mailOptions = new MailOptions(testTo);
      expect(mailOptions.to).to.be.eql(testTo);
      expect(mailOptions).to.have.own.property("from");
      expect(mailOptions).to.have.own.property("subject");
      expect(mailOptions).to.have.own.property("text");
    });
  });

  describe('sendEmailCallback()', () => {
    it('should invoke a stub for transport.sendMail()', () => {
      let testEmail = `learnjavascriptyes@gmail.com`;
      let sendMailStub = sinon.stub(transporter, 'sendMail');

      sendEmailCallback(testEmail);
      expect(sendMailStub).to.be.calledOnce;
      sendMailStub.restore();
    });
  });

  describe('findBirthdays()', () => {
    it('should invoke a stub for Birthday.find()', () => {
      let findBirthdaysSpy = sinon.spy(findBirthdays);
      let testDate = dateToday();
      let BirthdayStub = sinon.stub(Birthday, 'find');
      //If BirthdayStub resolves with an email, a real email will be sent.
      //To avoid this, it resolves an empty array.
      BirthdayStub.resolves([]);

      findBirthdaysSpy(testDate);
      expect(findBirthdaysSpy).to.be.calledWith(testDate);
      expect(BirthdayStub).to.be.calledOnce;

      BirthdayStub.restore();
    });
  });

  describe('findBirthdays()', () => {
    it('should send an email based on the object returned from database', done => {
      //This generates a side effect.  Check in testNodemailer.js for usage instructions
      testNodemailer();
      done();
    });
  });
});

describe('dateToday()', () => {
  it("should return today's date in the specified format", () => {
    let today = dateToday();
    let validator = date => {
      return /\d{1,2}\/\d{1,2}/.test(date);
    };

    let dateCheck = validator(today);
    expect(dateCheck).to.be.true;
  });
});

describe('task() in cron', () => {
  it('should use a stub to run cron.schedule()', () => {
  let stub = sinon.stub(task, "start");
  stub();
  expect(stub).to.be.calledOnce;
  stub.restore();
  });
});
