var express = require('express');
var router = express.Router();
var db = require("../../config/db.js");

/**
 * 记账页
 */
router.post("/list",function(req,res,next){
    var token = req.cookies.token;
    var tokenData = req.session.tokenData;
    console.log(tokenData)
    if(!tokenData || !token){
        //res.redirect('/404');  // 将用户重定向到登录页面
        res.json({title:"账单为空",data:{}});
    }else{
        db.query("select * from bill where uid="+tokenData.userid+" order by time desc",function(err,rows){
            if(err){
                res.json({title:"账单为空",data:{total:0,rows:[]}});
            }else {
                res.json({title:'账单列表',data:{total:rows.length,rows:rows}});
            }
        }); 
    }
});
router.post("/add",function(req,res,next){
    var time = req.body.time;
    var remark = req.body.remark;
    var money = req.body.money;
    var uid = req.session.tokenData.userid;
	db.query("insert into bill(remark,money,time,uid) values('"+remark+"','"+money+"','"+ time +"','"+Number(uid)+"')",function(err,rows){
        if(err){
            res.send("新增失败"+err);
        }else {
            //res.redirect("/worklist");
            db.query("select * from bill",function(err,rows){
            	if(err){
		            res.send("新增失败"+err);
		        }else {
            		res.json({errcode:"0",msg:'成功',rows:rows[rows.length-1]});
		        }
            })
        }
    });
});
router.post("/update",function(req,res,next){
    var time = req.body.time;
    var remark = req.body.remark;
    var id = req.body.id;
    var money = req.body.money;

    var sql = "update bill set remark = '"+ remark +"',time = '"+ time +"',money = '"+money+"' where id = " + id;
	db.query(sql,function(err,rows){
        if(err){
            res.send("编辑失败"+err);
        }else {
        	res.json({errcode:"0",msg:'成功'});
            // res.redirect("/worklist");
        }
    });
});
router.post("/delete",function(req,res,next){
    var id = req.body.id;
    db.query("delete from bill where id = " + id,function(err,rows){
        if(err){
            res.send("删除失败"+err);
        }else {
            res.send({errcode:"0",msg:'删除成功'});
        }
    });
});

module.exports = router;