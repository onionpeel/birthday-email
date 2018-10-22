// const expect = require('expect');
const request = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const {app} = require('./../server');
const {User} = require('./../models/user');
const {findBirthdays} = require('./../cron/findAndSendBirthdays/findBirthdays');
const {MailOptions} = require('./../cron/findAndSendBirthdays/MailOptions');
const {sendEmailCallback} = require('./../cron/findAndSendBirthdays/sendEmailCallback');
const {testNodemailer} = require('./testNodemailer');
const {transporter} = require('./../cron/findAndSendBirthdays/transporter');
const {dateToday} = require('./../cron/findAndSendBirthdays/dateToday');
const {bday, populateBday} = require('./seed/seed');
const {task} = require('./../cron/cron');

beforeEach(populateBday);

describe('ROUTES', () => {
  describe('POST/user', () => {
    it('should add a new user object in the database', (done) => {
      let bday = new User({
        email: "fake@mail.com",
        date: "11/11"
      });

      request(app)
        .post('/user')
        .send(bday)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).to.be.eql(bday.email);
          expect(res.body.date).to.be.eql(bday.date);
        })
        .end(done);
    });
  });

  describe('GET/users', () => {
    it('should return all of the user objects', done => {
      request(app)
        .get('/users')
        .expect(200)
        .end(done)
    });
  });
});

describe('FindBirthdays Module', () => {
  describe('MailOptions()', () => {
    it('should return a mailOptions object', () => {
      let testTo = process.env.EMAILUSERNAME;
      let mailOptions = new MailOptions(testTo);
      expect(mailOptions.to).to.be.eql(testTo);
      expect(mailOptions).to.have.own.property("from");
      expect(mailOptions).to.have.own.property("subject");
      expect(mailOptions).to.have.own.property("text");
    });
  });

  describe('sendEmailCallback()', () => {
    it('should invoke a stub for transport.sendMail()', () => {
      let testEmail = process.env.EMAILUSERNAME;
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
      let BirthdayStub = sinon.stub(User, 'find');
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
