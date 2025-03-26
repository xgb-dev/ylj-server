var express = require('express');
var router = express.Router();
var db = require("../../config/db_bills.js");
const getResult = function (arr) {
  async function queue(arr) {
    let res = [];
    for (let fn of arr) {
      var data = await fn();
      res.push(data);
    }
    return await res;
  }
};

/**
 * 记账页
 */
router.get("/", function (req, res, next) {
  res.render('404', {
    title: '404'
  });
});
router.post('/userbill', function (req, res, next) {

  let dayNumSql = `select count(distinct date) as total from bills where _openid='${req.query.openid || req.body.openid}'`;
  let billNumSql = `select count(*) as total from bills where _openid='${req.query.openid || req.body.openid}'`;
  let query1 = new Promise((reslove, reject) => {
    db.query('test', dayNumSql, (err, rows) => {
      if (err) {
        reject({
          title: '查询错误',
          msg: err,
          errcode: 1
        });
      } else {
        reslove({
          msg: '查询成功',
          total: rows[0].total
        })
      }
    });
  });
  let query2 = new Promise((reslove, reject) => {
    db.query('test', billNumSql, (err, rows) => {
      if (err) {
        reject({
          title: '查询错误',
          msg: err,
          errcode: 1
        });
      } else {
        reslove({
          msg: '查询成功',
          total: rows[0].total
        });
      }
    });
  });

  Promise.all([query1, query2])
    .then(response => {
      res.json({
        dayTotal: response[0].total,
        billTotal: response[1].total,
        errcode: 0,
        msg: '成功'
      });
    }).catch(reason => {
      res.json({
        errcode: 1,
        msg: '失败'
      });
    });

});
router.post("/list", function (req, res, next) {
  let book = `select * from book where openid='${req.body.openid}'`;
  let sql = `select * from bills where _openid = '${req.body.openid}' AND y = ${req.body.y} AND m = ${req.body.m} AND status = 0 ORDER BY date DESC`;
  let insql = `SELECT SUM(amount) AS amount FROM bills WHERE _openid = '${req.body.openid}' AND y = ${req.body.y} AND m = ${req.body.m} AND type = 'in'`;
  let outsql = `SELECT SUM(amount) AS amount FROM bills WHERE _openid = '${req.body.openid}' AND y = ${req.body.y} AND m = ${req.body.m} AND type = 'out'`;
  var app1 = new Promise((reslove, reject) => {
    db.query("test", sql, (err, rows) => {
      if (err) {
        reject({
          title: "账单为空",
          data: {
            total: 0,
            rows: []
          }
        });
      } else {
        console.log(1);
        reslove({
          title: '账单列表',
          data: {
            total: rows.length,
            rows: rows
          }
        });
      }
    });
  });
  var app2 = new Promise((reslove, reject) => {
    db.query("test", insql, (err, rows) => {
      if (err) {
        reject({
          title: "月收入",
          data: {
            amount: 0
          }
        });
      } else {
        console.log(2);
        reslove({
          title: '月收入',
          data: {
            amount: rows[0].amount
          }
        });
      }
    });
  });
  var app3 = new Promise((reslove, reject) => {
    db.query("test", outsql, (err, rows) => {
      if (err) {
        reject({
          title: "月支出",
          data: {
            amount: 0
          }
        });
      } else {
        console.log(3);
        reslove({
          title: '月支出',
          data: {
            amount: rows[0].amount
          }
        });
      }
    });
  });
  Promise.all([app1, app2, app3])
    .then(response => {
      let average = (response[2].data.amount / new Date().getDate()).toFixed(2) || 0;
      console.log(average)
      res.json({
        list: response[0].data.rows,
        amountin: response[1].data.amount,
        amountout: response[2].data.amount,
        average: average,
        errcode: 0,
        msg: '成功'
      });
    }).catch(reason => {
      res.json({
        errcode: 1,
        msg: '失败'
      });
    });

});
router.post("/adminlist", (req, res, next) => {
  let sql = `select * from bills where y = ${req.body.y} AND status = 0 ORDER BY date DESC`;
  db.query("test", sql, (err, rows) => {
    if (err) {
      res.json({
        title: "账单为空",
        data: {
          total: 0,
          rows: []
        }
      });
    } else {
      res.json({
        title: '账单列表',
        data: {
          total: rows.length,
          rows: rows
        }
      });
    }
  });

});
router.post("/add", (req, res, next) => {
  let body = req.body;
  let params = `'${body.date}',${body.amount},'${body.remarks}','${body.text}','${body.type}','${body.nickname}','${body.openid}',${body.gender},'${body.city}','${body.y}','${body.m}','${body.d}','${body.icon}','${body.iconbg}',current_timestamp(),null`;
  let sql = `INSERT INTO bills (date,amount,remarks,text,type,nickname,_openid,gender,city,y,m,d,icon,iconbg,create_time,update_time) VALUES (${params})`;

  db.query('test', sql, (err, rows) => {
    if (err) {
      res.send({
        msg: "新增失败" + err,
        errcode: 1
      });
    } else {
      res.send({
        msg: "新增成功",
        errcode: 0
      });
    }
  });
});
router.post("/update", function (req, res, next) {
  let body = req.body;
  let params = `'${body.date}',${body.amount},'${body.remarks}','${body.text}','${body.type}','${body.nickname}','${body.openid}',${body.gender},'${body.city}','${body.y}','${body.m}','${body.d}','${body.icon}'`;
  let sql = `UPDATE bills SET date='${body.date}',amount=${body.amount},remarks='${body.remarks}',text='${body.text}',type='${body.type}',nickname='${body.nickname}',gender=${body.gender},city='${body.city}',y='${body.y}',m='${body.m}',d='${body.d}',icon='${body.icon}',iconbg='${body.iconbg}',update_time=current_timestamp() where _openid='${body.openid}' and id = ${body.id}`;


  db.query('test', sql, (err, rows) => {
    if (err) {
      res.send({
        errcode: 1,
        msg: "更新失败" + err
      });
    } else {
      res.json({
        errcode: "0",
        msg: '更新成功'
      });
    }
  });
});
router.post("/delete", (req, res, next) => {
  var id = req.body.id;
  // let sql = `delete from bills where _openid='${req.body.openid}' and id='${req.body.id}'`;
  let sql = `UPDATE bills SET status=1,delete_time=current_timestamp()  where _openid='${req.body.openid}' and id='${req.body.id}'`;
  db.query('test', sql, (err, rows) => {
    if (err) {
      res.send({
        errcode: 1,
        msg: "删除失败" + err
      });
    } else {
      res.send({
        errcode: "0",
        msg: '删除成功'
      });
    }
  });
});
router.post("/fullmonth", (req, res, next) => {
  let sql = `SELECT * FROM bills WHERE _openid = '${req.body.openid}' AND y = '${req.body.y}' AND m = ${req.body.m}`;
  db.query('test', sql, (err, rows) => {
    if (err) {
      res.send({
        errcode: 1,
        msg: "获取失败" + err
      });
    } else {
      res.send(rows);
    }
  });
});

module.exports = router;