const mysql = require('mysql');
let query = (db, sql, callback) => {
    console.log(process.env.NODE_ENV);
    let pool;
    if (process.env.NODE_ENV !== 'development') {
        console.log('线上');
        pool = mysql.createPool({
            connectionLimit: 20, //连接池连接数
            host: 'localhost', //数据库地址，这里用的是本地
            database: db, //数据库名称
            user: 'username',  // username
            password: 'password' // password
        });
    } else {
        console.log('本地');
        pool = mysql.createPool({
            connectionLimit: 20, //连接池连接数
            host: 'localhost', //数据库地址，这里用的是本地
            database: db, //数据库名称
            user: 'root',  // username
            password: 'pswd' // password
        });
    }
    pool.getConnection((err, connection) => {
        connection.query(sql, (err, rows) => {
            if (rows) {
                callback(err, rows);
            } else {
                callback(err, []);
            }
            connection.release();
        });
    });
};
exports.query = query;