const protect = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).send({ status: 'fail', msg: 'not authorized' });
  next();
};

module.exports = protect;
