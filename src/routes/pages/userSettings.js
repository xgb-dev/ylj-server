var express = require('express');
var router = express.Router();
var moment = require('moment');
var formidable = require('formidable');
var path = require("path");
var fs = require('fs');
var jwtChange = require('../../utils/jwtchange.js');




var db = require("../../config/db.js");
var mail = require("../../utils/mail.js");

/**
 * 登录页
 */

/**
 * 工作记录页
 */

router.get("/",function(req,res,next){

    var uid = req.session.tokenData.userid;
    db.query("select * from user where id="+uid,function(err,rows){
        if(err){
            res.render("user",{title:"个人设置",datas:[]});
        }else {
            res.render("user",{title:"个人设置",datas:rows});
        }
    });
});

router.get("/email",function(req,res,next){
    var uid = req.session.tokenData.userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    var recipient= 'zhuzheng.lei@163.com';
    var subject = '测试2';
    var html = '<div>12312312312311231321313123</div>'
    
    var mailData = mail(recipient, subject, html);

    res.send({data:mailData})
});

router.post("/posts",function(req,res,next){
    
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;

    var time = moment().format('YYYY-MM-DD HH:mm:ss');

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../public/avatar/upload");
    form.keepExtensions = true;//保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;
    //处理图片
    form.parse(req, function (err, fields, files){
        var filename = files.file.name
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length - 1];
        var name = '';
        for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        var date = new Date();
        var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
        var avatarName = name + time + '.' + type;
        var newPath = form.uploadDir + "/" + avatarName;
        fs.renameSync(files.file.path, newPath);  //重命名
        // 关联到用户头像
        var sql = "update user set avatar = 'avatar/upload/"+ avatarName +"' where id = " + uid;
        db.query(sql,function(err,rows){
            if(err){
                // res.render("user",{title:"个人设置",datas:[]});
            }else {
                // res.render("user",{title:"个人设置",datas:rows});
            }
        });
        res.send({data:"avatar/upload/"+avatarName})
    })
});

module.exports = router;
