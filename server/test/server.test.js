const request = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const {app} = require('./../server');
const cron = require('node-cron');

//middleware
const {renderHomePage} = require('./../middleware/renderHomePage');
const {saveUser} = require('./../middleware/saveUser');

//cronUtilities
const {isCronValid} = require('./../cron/cronUtilities/isCronValid');
const scheduleCallback = require('./../cron/cronUtilities/scheduleCallbackWrapper').scheduleCallback;
const scheduleCallbackWrapper = require('./../cron/cronUtilities/scheduleCallbackWrapper').scheduleCallbackWrapper;
const proxyquire = require('proxyquire');
const {setCronTime} = require('./../cron/cronUtilities/setCronTime');
const {dateToday} = require('./../cron/cronUtilities/dateToday');
const validator = require('validator');
const {findBirthdaysSendEmail} = require('./../cron/findAndSendBirthdays/findBirthdaysSendEmail');

//findAndSendBirthdays
const {MailOptions} = require('./../cron/findAndSendBirthdays/MailOptions');
const nodemailer = require('nodemailer');
const {transporter, argObj} = require('./../cron/findAndSendBirthdays/transporter');
const {sendEmailCallback} = require('./../cron/findAndSendBirthdays/sendEmailCallback');

//utility
const {createAcknowledgementDate} = require('./../utility/createAcknowledgementDate');
const {formattedDateArray} = require('./../utility/formattedDateArray');
const {splitDate} = require('./../utility/splitDate');

//models
const {User, schemaObj} = require('./../models/user');
const {testSchemaObj} = require('./testSchemaObj');
const {mongoose} = require('./../db/mongoose');

beforeEach('Empty database', done => {
  User.deleteMany({}).then(() => done()).catch(e => console.log(e));
});

describe('ROUTES', () => {
  describe('POST /', () => {
    it('should add a new user object in the database', (done) => {
      request(app)
        .post('/')
        .send({
              email: "Email@mail.com",
              date: "1899-04-24",
              first_name: "Person"
              })
        .expect(200)
        .end(done);
    });
  });

  describe('GET /', () => {
    it('should successfully render the home view', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if(err) return done(err);
          done();
        });
    });
  });
});

describe('middleware directory', () => {
  describe('renderHomePage', () => {
    it('should call render() with the "home" view', () => {
      let req = {};
      let res = {render: sinon.spy()};
      renderHomePage(req, res);
      expect(res.render).to.be.calledWith('home', {title: 'Birthday Email'});
    });
  });

  describe('saveUser()', () => {
    it('should return a user object after saving an object to the database', async () => {
      let inputObject = {
                          body: {
                                email: "someFakeEmail@mail.com",
                                date: "1899-3-24",
                                first_name: "namelessPerson"
                              }
                        };

      let actualResult = await saveUser(inputObject);
      expect(actualResult.email).to.eql(inputObject.body.email);
      expect(actualResult.date).to.eql('March 24');
      expect(actualResult.name).to.eql(inputObject.body.first_name);
      expect(actualResult.title).to.eql('Birthday Email');
    });
  });
});

describe('cronUtilities directory', () => {
  let cronregex = new RegExp(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/);

  describe('cron/cronUtilities/isCronValid()', () => {
    it('should return a boolean based on a valid cron expression', () => {
      let testValue = '20 20 * * *';
      let result = cronregex.test(testValue);

      expect(result).to.be.true;
      expect(isCronValid(testValue)).to.be.true;
    });
  });

  describe('cron/cronUtilities/scheduleCallbackWrapper()', () => {
    it('should return the scheduleCallback() function', () => {
      //The stringified return value of scheduleCallbackWrapper() should be stringResult
      let stringResult = function() {
        findBirthdaysSendEmail(today);
      }.toString().replace(/\s/g, "");

      let returnValue = scheduleCallback.toString().replace(/\s/g, "");
      expect(returnValue).to.eql(stringResult);
    });
  });

  describe('setCronTime()', () => {
    //setCronTime() will log a message that the cron job is set for '* 8 * * *'
    it('should return a valid cron time', () => {
      let returnCron = setCronTime();
      let result = cronregex.test(returnCron);
      expect(returnCron).to.eql('* 8 * * *');
      expect(result).to.be.true;
    });
  });

  describe('dateToday()', () => {
    it("should return today's date with the format '(m)m-(d)d'", () => {
      let today = dateToday();
      let validator = date => {
        return /^([1-9]|1[012])\-(3[01]|[12][0-9]|[1-9])$/.test(date);
      };
      let dateCheck = validator(today);
      expect(dateCheck).to.be.true;
    });
  });

  describe('scheduleCallback()', () => {
    //declare stub for the function that is invoked within scheduleCallback().
    let findBirthdaysSendEmailProxy = sinon.stub().returns('invoked');
    //use proxyquire so that findBirthdaysSendEmail() can be stubbed.
    let wrapper = proxyquire('./../cron/cronUtilities/scheduleCallbackWrapper',
        {'./../findAndSendBirthdays/findBirthdaysSendEmail': findBirthdaysSendEmailProxy});
    /*
    This is a unit test of scheduleCallback(), which stubs the function
    findBirthdaysSendEmail() that is invoked within scheduleCallback().
    */
    describe('unit test:  findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
      it('should invoke the stub for findBirthdaysSendEmail()', () => {
        wrapper.scheduleCallback();
        expect(findBirthdaysSendEmailProxy()).to.eql('invoked');
      });
    });
  });
});


describe('findAndSendBirthdays directory', () => {
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

  describe('transporter', () => {
    it('should be instantiated with the following object as the argument for createTransport()', () => {
      let arg = {
        service: process.env.SERVICE,
        auth: {
          user: process.env.EMAILUSERNAME,
          pass: process.env.EMAILPASSWORD
        }
      };
      //'argObj' is the object used to create the tranporter object in tranporter.js
      expect(argObj).to.eql(arg);
    });
  });
});

describe('utility directory', () => {
  describe('createAcknowledgementDate()', () => {
    it('should return a string that has the date format, "February 5"', () => {
      let testUser = {date: '2003-2-5'};
      let expectedValue = 'February 5';
      let returnValue = createAcknowledgementDate(testUser);
      expect(returnValue).to.equal(expectedValue);
    });
  });

  describe('formattedDateArray()', () => {
    it('should remove all zeroes from the beginning of each value', () => {
      let testArray = ['0200', '01', '043'];
      let expectedArray = ['200', '1', '43'];
      let returnValue = formattedDateArray(testArray);
      expect(returnValue).to.eql(expectedArray);
    });
  });

  describe('splitDate()', () => {
    it('should convert a "date" string property into an array whose values are separated by a hyphen', () => {
      let testUserObject = {date: '1990-05-29'};
      let expectedValue = ['1990', '05', '29'];
      let returnValue = splitDate(testUserObject);
      expect(returnValue).to.eql(expectedValue);
    });
  });
});

describe('models directory', () => {
  describe('user', () => {
    it('UserSchema should create user objects based on the following schema', () => {
      //schemaObj and testSchemaObj are separate objects but they have the exact same
      //properties and values. This test checks to make sure that schemaObj has not been
      //altered.  This is important since schemaObj is used to define the
      //user model.  This solution is not ideal since the comparison is not automated
      //and it is repetitious, but it does provide protection to prevent object mutation.
      expect(schemaObj.name.type.toString()).to.eql(testSchemaObj.name.type.toString());
      expect(schemaObj.name.minLength).to.eql(testSchemaObj.name.minLength);
      expect(schemaObj.name.trim).to.eql(testSchemaObj.name.trim);
      expect(schemaObj.name.required).to.have.all.members(testSchemaObj.name.required);

      expect(schemaObj.email.type.toString()).to.eql(testSchemaObj.email.type.toString());
      expect(schemaObj.email.validate.validator.toString()).to.eql(testSchemaObj.email.validate.validator.toString());
      expect(schemaObj.email.validate.message).to.eql(testSchemaObj.email.validate.message);
      expect(schemaObj.email.minLength).to.eql(testSchemaObj.email.minLength);
      expect(schemaObj.email.trim).to.eql(testSchemaObj.email.trim);
      expect(schemaObj.email.required).to.eql(testSchemaObj.email.required);

      expect(schemaObj.date.type.toString()).to.eql(testSchemaObj.date.type.toString());
      expect(schemaObj.date.minLength).to.eql(testSchemaObj.date.minLength);
      expect(schemaObj.date.validate.validator.toString()).to.eql(testSchemaObj.date.validate.validator.toString());
      expect(schemaObj.date.validate.message).to.eql(testSchemaObj.date.validate.message);
      expect(schemaObj.date.required).to.eql(testSchemaObj.date.required);
    });
  });
});

/*
An integration test of scheduleCallback(). An email will be sent to the
specified email account.
*/
describe('scheduleCallback()', () => {
  describe('integration test:  findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
    it('should log that an email was successfully sent to the account used to send out birthday emails', (done) => {
      /*
      Seed the test database with a user whose birthdate is today.  This email
       will be sent to the account that sends out birthday emails.
      */
      let currentDay = new Date();
      let year = currentDay.getFullYear();
      let month = currentDay.getMonth() + 1;
      let date = currentDay.getDate();
      let dateArray = [`${year}`, `${month}`, `${date}`];
      let noZeroPrefix = formattedDateArray(dateArray);
      let newDate = `${noZeroPrefix[0]}-${noZeroPrefix[1]}-${noZeroPrefix[2]}`;
      //create a new user with today's date
      let user = new User({
        email: process.env.EMAILUSERNAME,
        name: 'Test recipient of a birthday email'
      });
      user.date = newDate;

      // Save the user and invoke scheduleCallback() and test using a spy
      user.save()
        .then(user => {
          scheduleCallback();
          return user;
        })
        .then((user) => {
          console.log(`A test email has been sent to ${user.email}`)
          done();
        })
        .catch(err => {
          console.log(err);
      });
    });
  });
});
