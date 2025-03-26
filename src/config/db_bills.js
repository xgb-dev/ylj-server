const mysql = require('mysql')
function query(db, sql, callback){
  const pool = mysql.createPool({
    connectionLimit: 20, //连接池连接数
    host: 'localhost', //数据库地址，这里用的是本地
    database: db, //数据库名称
    user: 'root',  // username
    password: 'pswd' // password
  });
  // const pool = mysql.createPool({
  //   connectionLimit: 20, //连接池连接数
  //   host: 'localhost', //数据库地址，这里用的是本地
  //   database: db, //数据库名称
  //   user: 'username',  // username
  //   password: 'password', // password
  //   port: 3306
  // });
  pool.getConnection(function(err,connection){
      connection.query(sql, function (err,rows) {
          callback(err,rows);
          connection.release();
      });
  });
}

exports.query = query;