const jwt = require('jsonwebtoken');

const generateResetToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = { generateResetToken }; 