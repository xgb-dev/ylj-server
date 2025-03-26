var express = require('express');
var router = express.Router();
var db = require("../../config/db.js");


var fs = require('fs');

/**
 * 登录页
 */
router.get("/",function(req,res,next){
    res.render('login', { title: 'Duzimu' });
});

module.exports = router;
