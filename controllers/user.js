const User = require('../models/user');
const bcrypt = require('bcryptjs');

const signup = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashPassword });
    req.session.user = user;
    res.send({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).send({ status: 'fail' });
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ status: 'fail', msg: 'no user found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .send({ status: 'fail', msg: 'username or password is not correct' });
    }
    req.session.user = user;
    // res.set('X-Server-Header', 'Hello from the server!');
    // res.set('X-Server-Header2', 'Hello from the server! 2');
    res.send({ status: 'success', data: { user } });
  } catch (err) {
    res.status(400).send({ status: 'fail' });
  }
};

module.exports = {
  login,
  signup,
};
