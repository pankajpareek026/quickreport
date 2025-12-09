// Validation middleware for routes
const validateCoinName = (req, res, next) => {
  if (!req.query.Asset) {
    res.redirect('/dash-bord');
  } else {
    next();
  }
};

module.exports = {
  validateCoinName
};

