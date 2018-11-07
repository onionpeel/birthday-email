const nock = require('nock');
const request = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const {app} = require('./../server');
const {sendEmailCallback} = require('./../cron/findAndSendBirthdays/sendEmailCallback');
const {testNodemailer} = require('./testNodemailer');
const {bday, populateBday} = require('./seed/seed');
const cron = require('node-cron');
const proxyquire = require('proxyquire');
const task = require('./../cron/cron');
//cronUtilities
const {isCronValid} = require('./../cron/cronUtilities/isCronValid');
const scheduleCallback = require('./../cron/cronUtilities/scheduleCallbackWrapper').scheduleCallback;
const scheduleCallbackWrapper = require('./../cron/cronUtilities/scheduleCallbackWrapper').scheduleCallbackWrapper;
const {setCronTime} = require('./../cron/cronUtilities/setCronTime');
const {dateToday} = require('./../cron/cronUtilities/dateToday');
const {findBirthdaysSendEmail} = require('./../cron/findAndSendBirthdays/findBirthdaysSendEmail');
//findAndSendBirthdays
const {MailOptions} = require('./../cron/findAndSendBirthdays/MailOptions');
const nodemailer = require('nodemailer');
const {transporter, argObj} = require('./../cron/findAndSendBirthdays/transporter');
//users
const {User, schemaObj} = require('./../models/user');
const validator = require('validator');
const {testSchemaObj} = require('./testSchemaObj');
const mongoose = require('mongoose');
//utility
const {createAcknowledgementDate} = require('./../utility/createAcknowledgementDate');
const {formattedDateArray} = require('./../utility/formattedDateArray');
const {splitDate} = require('./../utility/splitDate');
//middleware
const {renderHomePage} = require('./../middleware/renderHomePage');
//routes


describe('ROUTES', () => {
  beforeEach(done => {
    User.deleteMany({}).then(() => done()).catch(e => console.log(e));
  });

  describe('POST /', () => {
    it('should add a new user object in the database', (done) => {
      // let user = new User({
      //   email: "fake@mail.com",
      //   date: "2000-11-11",
      //   name: "mrTest"
      // });

      // let user = {
      //   "email": "fake@mail.com",
      //   "date": "2000-11-11",
      //   "first_name": "mrTest"
      // };

      // let user = {
      //   email: "fake@mail.com",
      //   date: "2000-11-11",
      //   name: "mrTest"
      // };

      let email = "fake@mail.com";
      let date = "2000-11-11";
      let first_name = "mrBowl";

      request(app)
        .post('/')
        .send({email, date, first_name})
        .expect(200)
          .expect((res) => {
            console.log(res.email)
            // expect(res.body.email).to.be.eql(email);
            // expect(res.body.date).to.be.eql(date);
            // expect(res.body.name).to.be.eql(name);
          })
        .end(done);
    });
  });
});



  // });
// });






//Unit test
//If the project is hosted remotely, this test will allow the GET /
//http method to be tested without making a live call to the endpoint.
//The domain in nock() will need to be changed if hosting remotely.
describe('GET /', () => {
  it('should make a successful request using nock--UNIT TEST', () => {
    nock('http://localhost:3000/')
      .get('/')
      .reply(200);

    return request(app)
      .get('/')
      .expect(200)
  });
});
//Integretion test
describe('GET /', () => {
  it('should successfully render the home view--INTEGRETION TEST', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        done();
      });
  });
});



// *************************
// describe('scheduleCallback()', () => {
//   //declare stub for the function that is invoked within scheduleCallback().
//   let findBirthdaysSendEmailProxy = sinon.stub().returns('invoked');
//   //use proxyquire so that findBirthdaysSendEmail() can be stubbed.
//   let wrapper = proxyquire('./../cron/cronUtilities/scheduleCallbackWrapper',
//       {'./../findAndSendBirthdays/findBirthdaysSendEmail': findBirthdaysSendEmailProxy});
//
//   /*
//   This is a unit test of scheduleCallback(), which stubs the function
//   findBirthdaysSendEmail() that is invoked within scheduleCallback().
//   */
//   describe('unit test--findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
//     it('should invoke the stub for findBirthdaysSendEmail()', () => {
//       wrapper.scheduleCallback();
//       expect(findBirthdaysSendEmailProxy()).to.eql('invoked');
//     });
//   });
// });

//DONE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//

describe('cronUtilities directory', () => {
  let cronregex = new RegExp(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/);

  describe('cron/cronUtilities/isCronValid()', () => {
    it('should return a boolean based on whether the input is a valid cron expression', () => {
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
    it('should be created with the following object as the argument for createTransport()', () => {
      let arg = {
        service: process.env.SERVICE,
        auth: {
          user: process.env.EMAILUSERNAME,
          pass: process.env.EMAILPASSWORD
        }
      };
      expect(argObj).to.eql(arg);
    });
  });
});


  /*
  An integration test of scheduleCallback(). There are two ways for this test
  to pass: 1) an email will be sent to the specified email account and 2) the
  spy, scheduleCallbackSpy, will have been called.
  */
describe('scheduleCallback()', () => {
  describe('integration test--findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
    //empty the test database so that only one user exists when the message is sent
    // beforeEach(done => {
    //   User.deleteMany({}).then(() => done()).catch(e => console.log(e));
    // });

    //declare the spy
    // let scheduleCallbackSpy = sinon.spy(wrapper, 'scheduleCallback');

    // let findBirthdaysSendEmailSpy = sinon.spy(wrapper, 'scheduleCallback');
    //
    //
    // let wrapper = proxyquire('./../cron/cronUtilities/scheduleCallbackWrapper',
    //     {'./../findAndSendBirthdays/findBirthdaysSendEmail': findBirthdaysSendEmailSpy});

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
          // if(expect(scheduleCallbackSpy).to.have.been.called) {
          //   console.log(`A test email has been sent to ${user.email}`)
          // };
          // scheduleCallbackSpy.restore();
          console.log(`A test email has been sent to ${user.email}`)
          done();
        })
        .catch(err => {
          console.log(err);
      });
    });
  });
});


describe('models directory', () => {
  describe('user', () => {
    it('UserSchema should create user objects based on the following schema', () => {
      //schemaObj and testSchemaObj are separate objects but they have the exact same
      //properties and values. This test checks to make sure that schemaObj has not been
      //altered.  This is important since it is the schema that is used to define the
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

describe('utility module', () => {
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
