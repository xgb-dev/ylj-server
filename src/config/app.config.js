module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  // 其他配置...
  jwt: {
    // JWT 密钥，建议使用环境变量
    secret: process.env.JWT_SECRET || 'ZZLSL',
    // token 过期时间
    expiresIn: '24h'
  },
};