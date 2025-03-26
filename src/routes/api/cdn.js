var express = require('express');
var router = express.Router();
var db = require("../../config/db_bills.js");
/**
 * 图片相关
 */
router.get("/", function (req, res, next) {
  let titleId = req.query.id;
  if(titleId){
    let app1 = new Promise((reslove, reject) => {
      db.query('qiniu', `select * from title where id=${titleId}`, function(err, rows){
        if(err){
          reject(err);
        }else {
          reslove(rows);
        }
      });
    });
    let app2 = new Promise((reslove, reject) => {
      db.query('qiniu', `select * from img where title_id=${titleId}`, function(err, rows){
        if(err){
          reject(err);
        }else {
          reslove(rows);
        }
      });
    });
    Promise.all([app1, app2])
      .then(response => {
        res.json({
          title: response[0][0],
          imgList: response[1],
          errcode: 0,
          msg: '成功'
        });
      }).catch(reason => {
        res.json({errcode: 1, msg: '失败'});
      });
  }else{
    try {
      db.query('qiniu', `select * from title`, function(err, rows){
        if(err){
          reject(err);
        }else {
          res.json({data: rows, errcode: 0});
        }
      });
    } catch (error) {
      res.json({errcode: 1, error: error});
    }
  }
});
router.post("/", function (req, res, next) {
  let title  = req.body.title;
  let address = req.body.address;
  db.query('qiniu', `INSERT INTO title (title, address) VALUES ('${title}','${address}')`,function(err, rows){
    if(err){
      res.json({errcode: "1", data: err});
    }else {
      res.json({errcode: '0', id: rows.insertId});
    }
  });
});
router.put("/", function (req, res, next) {
  let title = req.body.title;
  let address = req.body.address;
  let id = req.body.id;
  db.query('qiniu', `UPDATE title SET title='${title}',address='${address}' where id=${id}`, (err,rows) => {
    if(err){
      res.json({errcode: "1", data: err});
    }else {
      res.json({errcode: '0', data: rows.insertId});
    }
  });
});
router.delete("/", function (req, res, next) {
  const id = req.body.id;
  db.query("UPDATE title SET status=1 where id='"+id+"'",function(err,rows){
    if(err){
      res.json({errcode: "1", data: '用户验证失败'});
    }else {
      res.json({errcode: '0', data: rows});
    }
  });
});

module.exports = router;