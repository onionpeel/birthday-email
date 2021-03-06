//No inputs.  Returns a string with the current month and date that is used
//to search the database for matches.  It has the format: '(m)m-(d)d'.
let dateToday = () => {
  let now = new Date();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  return `${month}-${date}`;
};

module.exports = {dateToday};
