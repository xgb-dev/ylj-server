var db = require("../config/db.js");

const request = (params) => {
    let sql = params.sql;
    let database = params.db;
    return new Promise ((resolve, reject) => {
        db.query(database, sql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
 
module.exports = request;