var express = require('express');
var router = express.Router();
var db = require("../../config/db.js");
var request = require("../../utils/request.js");

const { createTheme, updateTheme, deleteTheme, findAllTheme, findThemeItem } = require('../../modules/blog/services/theme.js');

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

// 新增单条主题
router.post('/item', async function(req, res, next) {
  let body = req.body;
  createTheme(req.body)
  .then(response => {
    res.send({code: 0, msg: '成功',data: {insertId: response.theme_id}});
  }).catch(error => {
    res.json({msg: error, code: 1});
  });
});

// 更新单条主题
router.put('/item', async function(req, res, next) {
  let changeData = req.body;
  let where = {theme_id: req.body.theme_id};
  updateTheme(changeData, where)
  .then(response => {
    res.json({code: 0, msg: '成功'});
  }).catch(error => {
    res.json({msg: error, code: 1});
  });
});

// 删除单条主题
router.delete('/item', async function(req, res, next) {
  deleteTheme({theme_id: req.query.theme_id})
  .then(response => {
    res.json({code: 0, msg: '成功'});
  }).catch(error => {
    res.json({msg: error, code: 1});
  });
});

module.exports = router;