//Returns a string with the current month and date that is used to search the databases for matches
let dateToday = () => {
  let now = new Date();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  return `${month}-${date}`;
};

module.exports = {dateToday};
