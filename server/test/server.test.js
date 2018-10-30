const nock = require('nock');
const request = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const {app} = require('./../server');
const {User} = require('./../models/user');
const findBirthdaysSendEmail = require('./../cron/findAndSendBirthdays/findBirthdaysSendEmail');
const {MailOptions} = require('./../cron/findAndSendBirthdays/MailOptions');
const {sendEmailCallback} = require('./../cron/findAndSendBirthdays/sendEmailCallback');
const {testNodemailer} = require('./testNodemailer');
const {transporter} = require('./../cron/findAndSendBirthdays/transporter');
const dateToday = require('./../cron/findAndSendBirthdays/dateToday');
const {bday, populateBday} = require('./seed/seed');
const cron = require('node-cron');
const proxyquire = require('proxyquire');
const {task} = require('./../cron/cron');
//cron
const isCronValid = require('./../cron/cronUtilities/isCronValid');
const {scheduleCallback, scheduleCallbackWrapper} = require('./../cron/cronUtilities/scheduleCallbackWrapper');
const setCronTime = require('./../cron/cronUtilities/setCronTime');

// let findBirthdaysSendEmail = (date) => {
//   let dateRegex = new RegExp('^\\d{4}-' + date + '$');
//
//   User.find({date: {$regex: dateRegex}})
//     .then(users => {
//       users.forEach(sendEmailCallback);
//     })
//     .catch(e => {
//       console.log(e);
//     });
// };

// describe('findBirthdaysSendEmail()', () => {
//   it('should invoke User.find() with proper date query', () => {
//     let findStub = sinon.stub(User, 'find');
//
//
//
//     findBirthdaysSendEmail('11-27');
//     let queryObj = {'11-27': {$regex: /^\d{4}-11-27$/}};
//     expect(findStub).to.be.calledWith(queryObj);
//   });
// });







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
// describe('findAndSendBirthdays', () => {
//   describe('MailOptions()', () => {
//     it('should return a mailOptions object', () => {
//       let testTo = process.env.EMAILUSERNAME;
//       let mailOptions = new MailOptions(testTo);
//       expect(mailOptions.to).to.be.eql(testTo);
//       expect(mailOptions).to.have.own.property("from");
//       expect(mailOptions).to.have.own.property("subject");
//       expect(mailOptions).to.have.own.property("text");
//     });
//   });
//
//   describe('sendEmailCallback()', () => {
//     it('should invoke a stub for transport.sendMail()', () => {
//       let testEmail = process.env.EMAILUSERNAME;
//       let sendMailStub = sinon.stub(transporter, 'sendMail');
//
//       sendEmailCallback(testEmail);
//       expect(sendMailStub).to.be.calledOnce;
//       sendMailStub.restore();
//     });
//   });
//
//   describe('findBirthdaysSendEmail()', () => {
//     it('should invoke a stub that takes the place of User.find()', () => {
//       let findBirthdaysSendEmailSpy = sinon.spy(findBirthdaysSendEmail);
//       let testDate = dateToday();
//       let BirthdayStub = sinon.stub(User, 'find');
//       //If BirthdayStub resolves with an email, a real email will be sent.
//       //To avoid this, it resolves an empty array.
//       BirthdayStub.resolves([]);
//
//       findBirthdaysSendEmailSpy(testDate);
//       expect(findBirthdaysSendEmailSpy).to.be.calledWith(testDate);
//       expect(BirthdayStub).to.be.calledOnce;
//
//       BirthdayStub.restore();
//     });
//   });

  // describe('findBirthdaysSendEmail()', () => {
  //   it('should send an email based on the object returned from database', done => {
  //     //This generates a side effect.  Check in testNodemailer.js for usage instructions
  //     testNodemailer();
  //     done();
  //   });
  // });

//   describe('dateToday()', () => {
//     it("should return today's date with the format '(m)m-(d)d'", () => {
//       let today = dateToday();
//       let validator = date => {
//         return /\d{1,2}\-\d{1,2}/.test(date);
//       };
//
//       let dateCheck = validator(today);
//       expect(dateCheck).to.be.true;
//     });
//   });
// });

// describe('cron.js', () => {
//   describe('isCronValid()', () => {
//     it('should return true if the input matches the regex', () => {
//       let cronInput = "10 9 * * *";
//       expect(isCronValid(cronInput)).to.be.true;
//     });
//   });
//
//   describe('scheduleCallback()', () => {
//     describe('findBirthdaysSendEmail() as a dependency inside of scheduleCallback()', () => {
//       let findBirthdaysSendEmailProxy = sinon.stub().returns('invoked');
//       let scheduleCallbackProxy = proxyquire('./../cron/cronUtilities/scheduleCallback',
//           {'./../findAndSendBirthdays/findBirthdaysSendEmail': findBirthdaysSendEmailProxy});
//
//       it('should invoke findBirthdaysSendEmail()', () => {
//         scheduleCallbackProxy();
//         expect(findBirthdaysSendEmailProxy()).to.eql('invoked');
//       });
//     });
//   });
// });


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
// describe('cronUtilities', () => {
//   let cronregex = new RegExp(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/);

  // describe('cron/cronUtilities/isCronValid()', () => {
  //   it('should return a boolean based on whether the input is a valid cron expression', () => {
  //     let testValue = '20 20 * * *';
  //     let result = cronregex.test(testValue);
  //
  //     expect(result).to.be.true;
  //     expect(isCronValid(testValue)).to.be.true;
  //   });
  // });
  //
  // describe('cron/cronUtilities/scheduleCallbackWrapper()', () => {
  //   it('should return the scheduleCallback() function', () => {
  //     //The stringified return value of scheduleCallbackWrapper() should be stringResult
  //     let stringResult = function() {
  //       findBirthdaysSendEmail(today);
  //     }.toString().replace(/\s/g, "");
  //
  //     let returnValue = scheduleCallback.toString().replace(/\s/g, "");
  //     expect(returnValue).to.eql(stringResult);
  //   });
  // });

//   describe('setCronTime()', () => {
//     it('should return a valid cron time', () => {
//       let returnCron = setCronTime();
//       console.log(returnCron)
//       let result = cronregex.test(returnCron);
//       expect(returnCron).to.eql('* 8 * * *');
//       expect(result).to.be.true;
//     });
//   });
// });
