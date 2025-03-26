var express = require('express');
var router = express.Router();
var db = require("../../config/db.js");
var request = require("../../utils/request.js");
const qiniu = require("qiniu");

// 获取单条主题
router.get('/', async function(req, res, next) {
  let itemSearch = {sql: `select * from theme where theme_id=${req.query.id}`, db: 'photo'};
  try{
    let data = await request(itemSearch);
    if(data[0].photo_ids){
      let photoSearch = {sql: `select * from photo where id IN (${data[0].photo_ids})`, db: 'photo'};
      let photosArray = await request(photoSearch);
      data[0].photo_ids = photosArray;
    }else{
      data[0].photo_ids = [];
    }
    res.json({code: 0, msg: '成功',data: data[0]});
  }catch(e){
    res.json({code: 1, msg: e});
  }
});

// 新增单条主题
router.post('/', async function(req, res, next) {
  let body = req.body;
  let params = `'${body.photo_title}','${body.photo_description}','${body.url}'`;
  let sql = `INSERT INTO photo (photo_title, photo_description, url) VALUES (${params})`;
  try{
    const searchData = {sql: sql, db: 'photo'};
    let data = await request(searchData);
    res.json({code: 0, msg: '成功',data: {insertId: data.insertId}});
  }catch (e) {
    res.json({msg: e, code: 1});
  }
});

// 更新单条主题
router.put('/', async function(req, res, next) {
  let body = req.body;
  let sql = `UPDATE photo SET photo_title='${body.photo_title}',photo_description='${body.photo_description}' where id = ${body.id}`;
  try{
    const searchData = {sql: sql, db: 'photo'};
    let data = await request(searchData);
    res.json({code: 0, msg: '成功'});
  }catch (e) {
    res.json({msg: e, code: 1});
  }
});

// 更新单条主题
router.delete('/', async function(req, res, next) {
  let body = req.query;
  let sql = `DELETE FROM photo WHERE id='${body.id}'`;
  try{
    if (body.id) {
      const searchData = {sql: sql, db: 'photo'};
      let data = await request(searchData);
    }
    const accesskey = 'S9X7MF2wy6BCIAuBt8sX683A6wht71oeYgkEdUYK';
    const secretKey = '19aANWcSh5OzpSiaVuGPWxSFr8nm9Z_qXawhjRUe';
    qiniu.conf.ACCESS_KEY = accesskey;
    qiniu.conf.SECRET_KEY = secretKey;
    //构建bucketmanager对象
    var bucketManager = new qiniu.rs.BucketManager();
    //你要测试的空间， 并且这个key在你空间中存在
    bucket = 'images';
    key = body.url;
    // 删除资源
    bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
      if (err) {
        throw err;
      } else {
        res.json({code: 0, msg: '删除成功'});
      }
    });
  }catch (e) {
    res.json({msg: e, code: 1});
  }
});

module.exports = router;