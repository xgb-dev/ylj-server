const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('youlaji', 'root', 'pswd', {
  dialect: 'mysql',
  host: 'localhost',
  timezone: '+08:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试数据库连接
async function testConnection() {
  try {
      await sequelize.authenticate();
      console.log('数据库连接成功');
  } catch (error) {
      console.error('数据库连接失败:', error);
  }
}

testConnection();

module.exports = sequelize;
// if (process.env.NODE_ENV !== 'development') {
//     console.log('线上');
//     pool = mysql.createPool({
//         connectionLimit: 20, //连接池连接数
//         host: 'localhost', //数据库地址，这里用的是本地
//         database: db, //数据库名称
//         user: 'username',  // username
//         password: 'password' // password
//     });
// } else {
//     console.log('本地');
//     pool = mysql.createPool({
//         connectionLimit: 20, //连接池连接数
//         host: 'localhost', //数据库地址，这里用的是本地
//         database: db, //数据库名称
//         user: 'root',  // username
//         password: 'pswd' // password
//     });
// }