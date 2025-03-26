const jwt = require('jsonwebtoken');
const config = require('../config/app.config');
const { error } = require('./response');

/**
 * 生成 JWT token
 * @param {Object} user - 用户信息
 * @returns {string} JWT token
 */
exports.generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    iat: Date.now()
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn // 例如：'24h'
  });
};