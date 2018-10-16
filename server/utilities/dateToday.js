let dateToday = () => {
  let now = new Date();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  return `${month}-${date}`;
};

module.exports = {dateToday};
