var express = require('express');
var router = express.Router();
var db = require("../../config/db_bills.js");
/**
 * 图片相关
 */
router.get("/", function (req, res, next) {
  let titleId = req.body.id;
  console.log('成功:'+res.require.id)
  let app1 = new Promise((reslove, reject) => {
    db.query('qiniu', `select * from title where id=${titleId}`, function(err, rows){
      if(err){
        reject(err)
      }else {
        reslove(rows);
      }
    });
  });
  let app2 = new Promise((reslove, reject) => {
    db.query('qiniu', `select * from img where title_id=${titleId}`, function(err, rows){
      if(err){
        reject(err)
      }else {
        reslove(rows);
      }
    });
  });

  Promise.all([app1, app2])
    .then(response => {
      res.json({
        title: response[0].rows[0],
        imgList: response[1].rows,
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
router.post("/", function (req, res, next) {
  let src  = req.body.src;
  let id = req.body.id;
  db.query('qiniu', `INSERT INTO img (title_id, url) VALUES ('${id}','${src}')`,function(err, rows){
    if(err){
      res.json({errcode: "1", data: err});
    }else {
      res.json({errcode: '0', id: rows.insertId});
    }
  });
});
router.delete("/", function (req, res, next) {
  let id = req.body.id;
  db.query('qiniu', `UPDATE img SET status='1' where id=${id}`,function(err,rows){
    if(err){
      res.json({errcode: "1", data: '用户验证失败'});
    }else {
      res.json({errcode: '0', data: rows});
    }
  });
});

module.exports = router;