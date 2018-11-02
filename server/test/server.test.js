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
const isCronValid = require('./../cron/cronUtilities/isCronValid');
const scheduleCallback = require('./../cron/cronUtilities/scheduleCallbackWrapper').scheduleCallback;
const scheduleCallbackWrapper = require('./../cron/cronUtilities/scheduleCallbackWrapper').scheduleCallbackWrapper;
const setCronTime = require('./../cron/cronUtilities/setCronTime');
const dateToday = require('./../cron/cronUtilities/dateToday');
const findBirthdaysSendEmail = require('./../cron/findAndSendBirthdays/findBirthdaysSendEmail');
const formattedDateArray = require('./../utility/formattedDateArray');
//findAndSendBirthdays
const MailOptions = require('./../cron/findAndSendBirthdays/MailOptions');
const nodemailer = require('nodemailer');
const {transporter, argObj} = require('./../cron/findAndSendBirthdays/transporter');
//users
const {User, schemaObj} = require('./../models/user');
const validator = require('validator');
const {testSchemaObj} = require('./testSchemaObj');

describe('models directory', () => {
  describe('user', () => {
    it('UserSchema should create user objects based on the following schema', () => {
      //schemaObj and testSchemaObj are separate objects but they have the exact same
      //properties and values. This test checks to make sure that schemaObj has not been
      //altered.  This is important since it is the schema that is used to define the
      //user model.
      expect(schemaObj.name.minLength).to.eql(testSchemaObj.name.minLength);
      expect(schemaObj.name.type.toString()).to.eql(testSchemaObj.name.type.toString())

    });
  });
});





//Asynchronous
// describe('task', () => {
//   it("should be an object that schedules a call to findBirthdaysSendEmail()", () => {
//
//     let findBirthdaysSendEmailStub = sinon.stub(findBirthdaysSendEmailObject, 'findBirthdaysSendEmail');
//     let date = dateToday();
//     findBirthdaysSendEmailStub(date);
//     expect(findBirthdaysSendEmailStub).to.be.calledOnce;
//
//   });
// });

//Synchronous
// describe('task', () => {
//   it("should be a stubbed object that schedules a call to findBirthdaysSendEmail on today's date", () => {
//
//     let scheduleSpy = sinon.stub(cron, 'schedule');
//
//   });
// });



  // describe('ROUTES', () => {
  //   describe('POST /', () => {
  //     it('should add a new user object in the database', (done) => {
  //       let bday = new User({
  //         email: "fake@mail.com",
  //         date: "11/11"
  //       });
  //
  //       request(app)
  //         .post('/')
  //         .send(bday)
  //         .expect(200)
  //         .expect((res) => {
  //           expect(res.body.email).to.be.eql(bday.email);
  //           expect(res.body.date).to.be.eql(bday.date);
  //         })
  //         .end(done);
  //     });
  //   });
  // });
  //


  // });
// });


//**************************************************************





// describe('server.js', () => {
//   //Asynchronous
//   describe('GET /', () => {
//     it('should make a successful request to the server', (done) => {
//       request(app)
//         .get('/')
//         .expect(200)
//         .end((err, res) => {
//           if (err) return done(err);
//           done();
//         });
//     });
//   });
//   //Synchronous
//   //If the project is hosted remotely, this test will allow the GET /
//   //http method to be tested without making a live call to the endpoint.
//   //The domain in nock() will need to be changed if hosting remotely.
//   describe('GET /', () => {
//     it('should make a successful request using nock', () => {
//       nock('http://localhost:3000/')
//         .get('/')
//         .reply(200);
//
//       return request(app)
//         .get('/')
//         .expect(200)
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
    describe('unit test--findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
      it('should invoke the stub for findBirthdaysSendEmail()', () => {
        wrapper.scheduleCallback();
        expect(findBirthdaysSendEmailProxy()).to.eql('invoked');
      });
    });
    /*
    An integration test of scheduleCallback(). There are two ways for this test
    to pass: 1) an email will be sent to the specified email account and 2) the
    spy, scheduleCallbackSpy, will have been called.
    */
    describe('integration test--findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
      //empty the test database so that only one user exists when the message is sent
      beforeEach(function() {
        return User.deleteMany({}).catch(e => console.log(e));
      });
      //declare the spy
      let scheduleCallbackSpy = sinon.spy(wrapper, 'scheduleCallback');

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
        //Save the user and invoke scheduleCallback() and test using a spy
        user.save()
          .then(user => {
            scheduleCallback();
            return user;
          })
          .then((user) => {
            if(expect(scheduleCallbackSpy).to.have.been.called) {
              console.log(`A test email has been sent to ${user.email}`)
            };
            scheduleCallbackSpy.restore();
            done();
          })
          .catch(err => {
            console.log(err);
        });
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
