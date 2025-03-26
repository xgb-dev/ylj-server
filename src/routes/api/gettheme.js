const { response } = require('express');
var express = require('express');
var router = express.Router();
// var db = require("../config/db.js");
// var request = require("../tool/request.js");
const { findAllTheme, findThemeItem } = require('../../modules/blog/services/theme');

router.get('/', function(req, res, next) {
  let pages = Number((req.query.pages-1)*req.query.limit);
  let limit = Number(req.query.limit);
  let where = {is_delete: "0"};
  
  findAllTheme(pages, limit, where).then(response => {
    let {count, rows} = response;
    res.send({code: 0, msg: '成功', data: rows, total: count});
  }).catch(error => {
    res.send({msg: error, code: 500});
  });
});

// 获取单条主题
router.get('/item', function(req, res, next) {
  const where = {
    theme_id: Number(req.query.id)
  };
  findThemeItem(where).then(response => {
    res.send({code: 0, msg: '成功', data: response});
  }).catch (error => {
    res.send({msg: error, code: 500});
  });
});

module.exports = router;