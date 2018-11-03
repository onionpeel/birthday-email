let renderHomePage = (req, res) => {
  res.render('home', {title: 'Birthday Email'})
};

module.exports = {renderHomePage};
