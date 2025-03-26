const jwt = require('jsonwebtoken');
var express = require('express');
const qiniu = require("qiniu");
var router = express.Router();
var request = require("request");

var db = require("../../config/db.js");
var requestFn = require("../../utils/request.js");
// let setToken = require('../../utils/setToken.js');
let setToken = () => '';

var fs = require('fs');
var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "16275757";
var API_KEY = "1POEoqh0FjQLqUtlCjB40GWQ";
var SECRET_KEY = "NPXLrWLSOckAzyUtUKfFMFz2cov4rXiX";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

router.post("/login", async (req, res, next) => {
    if(req.body.wx){
        console.log('微信登录');
        // 微信小程序登录
        let data=req.body
        let APP_URL='https://api.weixin.qq.com/sns/jscode2session',
            APP_ID='wxd1d8a59c396055f4',   //小程序的app id ，在公众开发者后台可以看到
            APP_SECRET='ced5ab98c1960e86ef0e41e0718c156c';  //程序的app secrect，在公众开发者后台可以看到
        if(req.body.js_code) {
            request(`${APP_URL}?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${req.body.js_code}&grant_type=authorization_code`, (error, response, body) => {
                let bodyObj = JSON.parse(body);
                let obj = {payload :{'username':bodyObj.openid ,'userid': 999999999}, expiresIn:'1d'};
                var token = setToken(obj);
                bodyObj.cookie = token;
                console.log(bodyObj)
                res.end(JSON.stringify(bodyObj));
            });
        }
    }else{
        console.log('网页登录');
        // web登录
        var name = req.body.name;
        var password = req.body.password;
        let sql = `select * from user where name='${name}' and pw='${password}'`;
        let searchData = {'sql': sql, 'db': 'user'};
        try {
            let rows = await requestFn(searchData);
            var obj = {payload :{'username': name,'userid': rows[0].id},expiresIn:'1d'};
            // req.session.tokenData = {'username': name,'userid': rows[0].id};
            var token = setToken(obj);
            res.cookie('token', token,{ expires: new Date(Date.now() + 18000000), httpOnly: false});
            // res.cookie('username', name);
            res.cookie('uid', rows[0].id);
            rows[0].token = token;
            res.json({errcode: 0, data: rows[0], msg: '成功'});
            return;
        } catch (error) {
            res.send({errcode: 1, data: error});
            return;
        }
    }
});
router.post("/registered",function(req,res,next){
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    
    db.query("insert into user(name,pw,email,is_vip) values('"+name+"','"+ password +"','"+email+"',0)",function(err,rows){
        if(err){
            res.send("新增失败"+err);
        }else {
            db.query('SELECT MAX(id) as id FROM user',function(err, rows){
                if(err){
                    res.json({errcode: 1,msg: "新增失败"+err});
                }else{
                    var uid = rows[0].id;
                    db.query("select * from menu",function(err, rows){

                        if(err){
                            res.json({errcode: 1,msg: "新增失败"+err});
                        }else {
                            for(let i = 0;i<rows.length;i++){
                                db.query("insert into usermenu(uid,menu_id,is_show) values('"+uid+"','"+ rows[i].id +"','"+rows[i].default_show+"')",function(err,rows){})
                            }
                        }
                    });
                    res.json({errcode: 0, msg: "注册成功", data: rows[0]});
                }
            });
        }
    });
    
});
router.post("/checkuid",function(req,res,next){
    var id = req.body.id;
    var name = req.body.name;
    db.query("select * from user where name='"+ name +"' and id='"+id+"'",function(err,rows){
        if(err){
            res.json({errcode: "1", data: '用户验证失败'});
        }else {
            // var obj = {payload :{'username': name,'userid': rows[0].id},expiresIn:'1d'}
            // var token = setToken(obj);
            res.cookie('uid', rows[0].id);
            res.cookie('username', name);
            res.json({errcode: '0', data: rows});
        }
    });
});
router.post("/signout",function(req,res,next){        
    req.session.username = '';
    res.cookie('username', '');
    res.cookie('userid', '');
});

router.post('/weixin', function(req, res, next) {
    // db.query(`select * from todo1 where id=1`,function(err,rows){
    //     if(err){
    //         res.json({title:"用户列表",datas:[]});
    //     }else {
    //         res.json({title:"code",datas:rows[0]});
    //     }
    // });
    // let APP_URL='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
    //     APP_ID='wxd1d8a59c396055f4',   //小程序的app id ，在公众开发者后台可以看到
    //     APP_SECRET='ced5ab98c1960e86ef0e41e0718c156c';  //程序的app secrect，在公众开发者后台可以看到
    // request.post(`${APP_URL}&appid=${APP_ID}&secret=${APP_SECRET}`, (error, response, body) => {
    //     let bodyObj = JSON.parse(body);
    //     console.log(bodyObj);
    var acc = '36_RxjaBtM6o8Q7APV14q5CoTl6Pk3NVZB46MGmwLDz-AK3LDeZoF3VaHxlwdo8POq6mfPWUXqi3w5jnco4lWKMVj2jJIBFS2pV-R-g_hzudQpf3Cm0fGJOlP6WKvuri-h_hJwxHYQGqW9wPiUbOFNiADARIQ'
        request({
            url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${acc}&scene=123456`,
            method: "POST",
            json: true,
            encoding: 'base64',
            headers: {
                "content-type": "application/json",
            },
            form: JSON.stringify({page:''})
        },
         (error, response, bodys) => {
            res.end(bodys);

        });
    //});
    // const base = new Buffer('eyJlcnJjb2RlIjo0MDE1OSwiZXJybXNnIjoiaW52YWxpZCBsZW5ndGggZm9yIHBhdGgsIG9yIHRoZSBkYXRhIGlzIG5vdCBqc29uIHN0cmluZyByaWQ6IDVmNGM4NzliLTQ0NTZlZDdlLTc0ZDViZDhiIn0=');
    // res.end(base);
});

router.get('/audio', function(req, res, next) {
	// 语音合成, 附带可选参数
	var tex = req.query.tex;
	var options={spd: 5, per: 0,pit:5};
	client.text2audio(tex, options).then(function(result) {
	    if (result.data) {
	        fs.writeFileSync('./public/tts.mpVoice.mp3', result.data);
	        res.send({errcode: 0, msg: '成功'});
	    } else {
	        // 服务发生错误
	        console.log(result);
	    }
	}, function(e) {
	    // 发生网络错误
	    console.log(e);
	});
});
router.post('/qiniuToken', function(req, res, next) {
    const accesskey = 'S9X7MF2wy6BCIAuBt8sX683A6wht71oeYgkEdUYK';
    const secretKey = '19aANWcSh5OzpSiaVuGPWxSFr8nm9Z_qXawhjRUe';
    //try {
        let mac = new qiniu.auth.digest.Mac(accesskey, secretKey);
        let options = {
           scope: 'images', //七牛资源目录
           expires: 3600*24
        };
        let putPolicy = new qiniu.rs.PutPolicy(options);
        // console.log('putPolicy:'+putPolicy)
        let uploadToken = putPolicy.uploadToken(mac);

        // console.log('uploadToken:'+uploadToken);
        // if(uploadToken){
        //     res.json({errcode: 0, msg: '成功', uploadToken: uploadToken});
        // }else{
        //     res.json({errcode: 1, msg: '获取失败'});
        // }
        console.log(uploadToken);
        res.json(uploadToken);
    //} catch (error) {
        //res.send({errcode: 500, msg: error});
    //}
});
module.exports = router; 
