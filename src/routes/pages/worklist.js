var express = require('express');
var router = express.Router();
var moment = require('moment');
var formidable = require('formidable');
var path = require("path");
var fs = require('fs');
var jwtChange = require('../../utils/jwtchange.js');



var db = require("../../config/db.js");
var dateformatter = require("../../utils/dateFormatter.js");
var taskSearch = require('../../utils/taskSearch.js');

/**
 * 登录页
 */

/**
 * 工作记录页
 */

router.get("/", function(req, res, next){
    // var token = req.header('authorization');
    // var tokenData = jwtChange(token);
    // var uid = tokenData.userid;
    // console.log(uid);
    db.query('user', "select * from user where id=2", function(err,rows){
        console.log({errs:err})
        console.log(rows)
        if(err){
            res.render("worklist",{title:"工作记录",datas:[]});
        }else {
            res.render("worklist",{title:"工作记录",datas:rows});
        }
    });
});

router.get("/items",function(req,res,next){
    //var token = req.cookies.token;
    //var tokenData = req.session.tokenData;
    
    db.query('user',"select * from worklist where uid=2 order by time desc",function(err,rows){
        if(err){
            res.json({title:"用户列表",data:{total:0,rows:[]}});
        }else {
            res.json({title:'工作记录',data:{total:rows.length,rows:rows}});
        }
    }); 
    
});
router.get("/order",function(req,res,next){
    //var token = req.header('authorization');
    //var tokenData = jwtChange(token);
    var sql_order = 'SELECT e.*,ifnull(d.count,0) as count FROM orderlist e '+
            'left join (select a.id,count(b.orderid) as count from orderlist a left join task b on b.orderid=a.id left join user c on c.id = a.uid where a.uid=2 and b.status=0 and b.delstatus=0 group by b.orderid,a.id) d '+
            'on d.id=e.id '+
            'where e.uid=2';

    var sql_label = 'SELECT e.*,ifnull(d.count,0) as count FROM label e LEFT JOIN (select a.id,count(b.labelid) as count from label a left join task b on FIND_IN_SET(a.id,b.labelid) where a.uid=2 and b.status=0 and b.delstatus=0 group by a.id) d on d.id=e.id where e.uid=2';
    // leftbar 列表
    let proLeft = new Promise((reslove, reject) => {
        db.query('orderlist', 'SELECT * FROM menu a LEFT JOIN usermenu b ON a.id = b.menu_id WHERE b.uid=2',function(err,rows){
            if(err){
                reject(err)
            }else{
                let data = {};
                rows.map((value) => {
                    data[value.key] = {
                        key: value.key,
                        count: 0,
                        name: value.name,
                        group: value.groups,
                        id: value.id,
                        is_show: value.default_show,
                        is_vip: value.is_vip,
                        icon: value.icon
                    };
                });
                reslove(data)
            }
        });
    });
    let allTaskPro = new Promise((reslove, reject) => {
        // 查出所有 uid==登录人 的任务
        db.query('user', 'select * from task where uid=2', function(err, rows){
            if(err) {
                reject(err);
            } else {
                reslove(rows);
            }
        });
    }); 
    let orderPro = new Promise((reslove, reject) => {
        // 清单列表
        db.query(sql_order,function(err,rows){
            if(err){
                reject(err);
            }else {
                let orderlist = rows;
                for(let i=0;i<orderlist.length;i++){
                    orderlist[i].time = moment(new Date(orderlist[i].time)).format('YYYY-MM-DD HH:mm:ss');
                }
                reslove(orderlist);
            }
        });
    });
    let labelPro = new Promise((reslove, reject) => {
        // 标签
        db.query(sql_label, function(err, rows) {
            if(err) {
                reject(err);
            }else{
                let labellist = rows;
                for(let i=0;i<labellist.length;i++){
                    labellist[i].time = moment(new Date(labellist[i].time)).format('YYYY-MM-DD HH:mm:ss');
                }
                reslove(labellist);
            }
        });
    })
    let handle = (response) => {
        let data = response[0], allTask = response[1],len = response[1].length,
            groupObj = {group0:[], group1:[], group2:[], orderlist: response[2],labellist: response[3]},
            today = moment().format('YYYY-MM-DD'),
            weekDate = moment().add(7, 'days').format('YYYY-MM-DD');
        if(len <= 0){
            // 不用去操作  count直接为0
        } else {            
            allTask.map((value) => {
                if(value.status == 0 && value.delstatus == 0){
                    data.all.count++;
                }                              
                if(value.delstatus == 1){
                    data.trash.count++;
                }
                if(value.status == 1 && value.delstatus == 0){
                    data.complete.count++;
                }
                if(value.delstatus == 0 && (value.orderid == null || value.orderid == '')){
                    data.inbox.count++;
                }
                if(value.plantime != null && value.plantime != ''){
                    let plantime = moment(value.plantime).format('YYYY-MM-DD');

                    if(plantime <= today && value.status == 0 && value.delstatus == 0){
                        data.today.count++;
                    }
                    if(plantime <= weekDate && value.status == 0 && value.delstatus == 0){
                        data.week.count++;
                    }
                }
            });
            for (let key in data){
                if (data[key].group == 1) {
                    groupObj.group0.push(data[key]);
                } else if (data[key].group == 2) {
                    groupObj.group1.push(data[key]);
                } else if (data[key].group == 3) {
                    groupObj.group2.push(data[key]);
                }
            }
        }
        return groupObj;
    };
    Promise.all([proLeft, allTaskPro, orderPro, labelPro])
    .then(response => {        
        let groupObj = handle(response);
        res.json({errcode:0,msg:'成功',title:'工作记录',groupObj});
    }).catch(reason => {
        res.json({errcode:1,msg:'失败',title:'工作记录',groupObj:{}});
    })
});
// 清单相关
router.post("/orderadd",function(req,res,next){
    var name = req.body.name;
    var theme = req.body.theme;
    var display = req.body.display;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.query("insert into orderlist(name,time,uid,theme,display) values('"+name+"','"+ time +"','"+Number(uid)+"','"+theme+"','"+display+"')",function(err,rows){
        if(err){
            res.send("新增失败"+err);
        }else {
            db.query("select * from orderlist where uid="+uid,function(err,rows){
                if(err){
                    res.send({errcode: 1, msg: "新增失败"+err});
                }else {
                    var row = rows[rows.length-1];
                    row.time = moment(new Date(row.time)).format('YYYY-MM-DD HH:mm:ss');
                    res.json({errcode: 0, msg: '成功', rows: row});
                }
            })
        }
    });
});

router.post("/orderupdate",function(req,res,next){
    var name = req.body.name;
    var id = req.body.id;
    var theme = req.body.theme;
    var display = req.body.display;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.query("update orderlist set name='"+name+"',theme='"+theme+"',display="+display+" where id="+id,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "修改失败"+err});
        }else {
            db.query("select * from orderlist where uid="+uid+" and id="+id,function(err,rows){
                if(err){
                    res.send({errcode: 1, msg: "修改失败"+err});
                }else {
                    var row = rows[0];
                    row.time = moment(new Date(row.time)).format('YYYY-MM-DD HH:mm:ss');
                    res.json({errcode: 0, msg: '成功', rows: row});
                }
            })
        }
    });
});

router.post("/orderdelete",function(req,res,next){
    var id = req.body.id;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    db.query("delete from orderlist where id="+id+" and uid="+uid,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "删除失败"+err});
        }else {
            
            res.send({errcode: 0, msg: '删除成功'});
        }
    })
});

// 标签相关
router.post("/labeladd",function(req,res,next){
    var name = req.body.name;
    var theme = req.body.theme;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.query("insert into label(name,time,uid,theme) values('"+name+"','"+ time +"','"+Number(uid)+"','"+theme+"')",function(err,rows){
        if(err){
            res.send({errcode: 1,msg: "新增失败"+err});
        }else {
            db.query("select * from label where uid="+uid,function(err,rows){
                if(err){
                    res.send({errcode: 1, msg: "新增失败"+err});
                }else {
                    var row = rows[rows.length-1];
                    row.time = moment(new Date(row.time)).format('YYYY-MM-DD HH:mm:ss');
                    res.json({errcode: 0, msg: '成功', rows: row});
                }
            })
        }
    });
});

router.post("/labelupdate",function(req,res,next){
    var name = req.body.name;
    var id = req.body.id;
    var theme = req.body.theme;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.query("update label set name='"+name+"',theme='"+theme+" where id="+id,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "修改失败"+err});
        }else {
            db.query("select * from label where uid="+uid+" and id="+id,function(err,rows){
                if(err){
                    res.send({errcode: 1, msg: "修改失败"+err});
                }else {
                    var row = rows[0];
                    row.time = moment(new Date(row.time)).format('YYYY-MM-DD HH:mm:ss');
                    res.json({errcode: 0, msg: '成功', rows: row});
                }
            })
        }
    });
});

router.post("/labeldelete",function(req,res,next){
    var id = req.body.id;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    db.query("delete from label where id="+id+" and uid="+uid,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "删除失败"+err});
        }else {
            
            res.send({errcode: 0, msg: '删除成功'});
        }
    })    
});

router.post("/tasklabelupdate",function(req,res,next){
    var labelid = req.body.labelid;
    var id = req.body.id;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.query("update task set labelid='"+labelid+"' where id="+id,function(err, rows){
        if(err){
            res.send({errcode: 1, msg: "修改失败"+err});
        }else {
            res.json({errcode: 0, msg: '成功'});
        }
    });
});

router.post("/task",function(req,res,next){
    //var token = req.header('authorization');
    //var tokenData = jwtChange(token);
    let type = req.body.parma,
    orderid = req.body.orderid || '',
    name = req.body.name
        
    let startToday = moment().format('YYYY-MM-DD') +' 00:00:00',
        endToday = moment().format('YYYY-MM-DD') + ' 23:59:59';

    // if(!tokenData || !token){
    //     res.redirect('/login');  // 将用户重定向到登录页面
    //     return;
    // }

    switch(type) {
        case 'today':
            // 今天
            let sql_today = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                            'left join orderlist a on a.id=b.orderid where b.uid=2 and b.status=0 and b.delstatus=0 and "'+ startToday+'">=b.plantime order by b.plantime ASC';
            var task = taskSearch(sql_today, 2,function(data){
                res.json(data)
            })
            break;
        case 'week':
            // 七天
            let weekDate = moment().add(7,'days').format('YYYY-MM-DD');
            let sql_week = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                            'left join orderlist a on a.id=b.orderid where b.uid=2 and b.status=0 and b.delstatus=0 and "'+ weekDate+'">=b.plantime order by b.plantime ASC';
            var task = taskSearch(sql_week, 2,function(data){
                res.json(data)
            })
            break;
        case 'calendar':
            // 日历
            let sql = 'select * from task order by plantime ASC';
            break;
        case 'inbox':
            // 收集箱
            let sql_inbox = 'select * from task where uid='
            +2+
            ' and status=0 and delstatus=0 and orderid is null order by plantime ASC';
            var task = taskSearch(sql_inbox, 2,function(data){
                res.json(data)
            })
            break;
        case 'complete':
            // 已完成
            let sql_complete = 'select a.*,b.name as ordername,b.display from task a left join orderlist b on b.id=a.orderid where a.uid='
            +2+
            ' and a.status=1 and a.delstatus=0 order by a.plantime ASC';
            var task = taskSearch(sql_complete, 2,function(data){
                res.json(data)
            })
            break;
        case 'trash':
            // 垃圾桶
            let sql_trash = 'select a.*,b.name as ordername,b.theme from task a left join orderlist b on a.orderid=b.id where a.uid='
            +tokenData.userid+
            ' and a.delstatus=1 order by a.plantime ASC';
            var task = taskSearch(sql_trash, tokenData.userid,function(data){
                res.json(data)
            })
            break;
        case 'abstract':
            // 摘要
            sql = 'select * from task order by plantime ASC';
            break;
        case 'orderlist':
            // 清单的
            let sql_orderlistsql = 'select * from task where uid='
            +tokenData.userid+
            ' and status=0 and delstatus=0 and orderid='+orderid+' order by plantime ASC';
            var task = taskSearch(sql_orderlistsql, tokenData.userid,function(data){
                res.json(data)
            })
            break;
        case 'labellist':
            // 标签的
            let sql_labellistsql = 'SELECT c.*,f.img from (select a.*,b.name as ordername,b.theme from task a LEFT JOIN orderlist b on a.orderid=b.id where a.uid='
            +tokenData.userid+
            ' and a.status=0 and a.delstatus=0 and find_in_set("'+orderid+'",a.labelid) order by plantime ASC) c LEFT JOIN taskimg f on c.id=f.taskid';
            console.log('进来了')
            var task = taskSearch(sql_labellistsql, tokenData.userid,function(data){
                res.json(data)
            })
            break;
        default:
    } 
    
});

router.post("/check",function(req,res,next){
    var id = req.body.id;
    var status = req.body.status;
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    // var uid = req.session.tokenData.userid;
    var uid = tokenData.userid;
    var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');    
    var completetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    if(status==0){
        completetime='1970-01-01 00:00:00'
    }
    var sql = "update task set status = "+ status +",completetime = '"+ completetime +"' where id = " + id;

    db.query(sql,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "修改失败"+err});
        }else {
            res.json({errcode: 0, msg: '修改成功'});
        }
    });
});

router.post("/taskdel",function(req,res,next){
    var id = req.body.id;
    
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;    
    var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var sql = "update task set status = "+ status +",completetime = '"+ completetime +"' where id = " + id;
    db.query(sql,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "修改失败"+err});
        }else {
            res.json({errcode: 0, msg: '修改成功'});
        }
    });
});

router.post("/plantimeupdate",function(req,res,next){
    var id = req.body.id;
    var plantime = req.body.plantime;
    
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;
    var sql = "update task set plantime = '"+ plantime +"' where id = " + id;
    db.query(sql,function(err,rows){
        if(err){
            res.send({errcode: 1, msg: "修改失败"+err});
        }else {
            res.json({errcode: 0, msg: '修改成功'});
        }
    });
});

router.post("/tasktitlechange",function(req,res,next){
    var id = req.body.id;
    var name = req.body.name;
    
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;       
    var edittime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    
    var sql = "update task set name = '"+ name +"',edittime = '"+ edittime +"' where id = " + id+' and uid=' + uid;
    db.query(sql,function(err,rows){
        if(err){
            res.send({errcode:'1',msg:"修改失败"+err});
        }else {
            res.json({errcode:"0",msg:'修改成功'});
        }
    });
});

router.post("/taskdetailchange",function(req,res,next){
    var id = req.body.id;
    var detail = req.body.detail;
    
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;
    var edittime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var sql = "update task set detail = '"+ detail +"',edittime = '"+ edittime +"' where id = " + id+' and uid=' + uid;
    db.query(sql,function(err,rows){
        if(err){
            res.send({errcode:1,msg:"修改失败"+err});
        }else {
            res.json({errcode:0,msg:'修改成功'});
        }
    });
});

router.post("/taskadd",function(req,res,next){
    var orderid = req.body.orderid || null;
    var name = req.body.name;
    var ordername = req.body.ordername;
    var plantime = req.body.plantime ?'"'+req.body.plantime+'"': null;
    var level = req.body.level || 0;
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;
    var time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    var sql = "insert into task(name,time,plantime,edittime,level,status,orderid,uid) values('"+name+"','"+ time +"',"+plantime +",'"+time+"',"+level+",0,"+orderid+","+uid+")";
    
    if(plantime==null){
        sql = "insert into task(name,time,plantime,edittime,level,status,orderid,uid) values('"+name+"','"+ time +"',"+plantime +",'"+time+"',"+level+",0,"+orderid+","+Number(uid)+")";
    }
    db.query(sql,function(err,rows){
        if(err){
            res.json({errcode: 1,msg: "新增失败"+err});
        }else {
            db.query("SELECT MAX(id) as id FROM task where uid="+uid,function(err,rows){
                if(err){
                    res.json({errcode: 2,msg: "新增失败"+err});
                }else {
                    var task = taskSearch('select a.*,b.name as ordername,b.theme from task a left join orderlist b on a.orderid=b.id where a.id='+rows[0].id, uid,function(data){
                        res.json(data)
                    })
                }
            });
        }
    });
});
router.post("/taskdelete",function(req,res,next){
    var id = req.body.id;
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;
    var sql = "update task set delstatus=1 where id = " + id+" and uid="+uid;
    db.query(sql,function(err,rows){
        if(err){
            res.json({errcode: 1, msg: "删除失败"+err});
        }else {

            res.json({errcode: 0, msg: '删除成功'});
        }
    });
});

router.post("/taskbrush",function(req,res,next){
    var id = req.body.id;
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;
    var sql = "delete from task where delstatus=1 and uid="+uid;
    db.query(sql,function(err,rows){
        if(err){
            res.json({errcode: 1, msg: "删除失败"+err});
        }else {
            res.json({errcode: 0, msg: '删除成功'});
        }
    });
});
router.post("/uplevel",function(req,res,next){
    var id = req.body.id;
    var level = req.body.level;

    var token = req.header('authorization');
    var uid = jwtChange(token).userid;   
    var sql = "update task set level = "+ level +" where id = " + id;
    db.query(sql,function(err,rows){
        if(err){
            res.json({errcode: 1, msg: "编辑失败"+err});
        }else {
            res.json({errcode: 0, msg: '成功'});
        }
    });
});
router.post("/items/add",function(req,res,next){
    var time = req.body.time;
    var text = req.body.text;
    var uid = req.session.tokenData.userid;
	db.query("insert into worklist(text,time,uid) values('"+text+"','"+ time +"','"+Number(uid)+"')",function(err,rows){
        if(err){
            res.send("新增失败"+err);
        }else {
            //res.redirect("/worklist");
            db.query("select * from worklist",function(err,rows){
            	if(err){
		            res.send("新增失败"+err);
		        }else {
            		res.json({errcode:"0",msg:'成功',rows:rows[rows.length-1]});
		        }
            })
        }
    });
});

router.post("/items/update",function(req,res,next){
    var time = req.body.time;
    var text = req.body.text;
    var id = req.body.id;

    var sql = "update worklist set text = '"+ text +"',time = '"+ time +"' where id = " + id;
	db.query(sql,function(err,rows){
        if(err){
            res.send("编辑失败"+err);
        }else {
        	res.json({errcode:"0",msg:'成功'});
            // res.redirect("/worklist");
        }
    });
});

router.post("/items/delete",function(req,res,next){
    var id = req.body.id;
    db.query("delete from worklist where id = " + id,function(err,rows){
        if(err){
            res.send("删除失败"+err);
        }else {
            res.send({errcode:"0",msg:'删除成功'});
        }
    });
});


router.post("/taskimg",function(req,res,next){
    
    var token = req.header('authorization');
    var uid = jwtChange(token).userid;
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../public/taskimg/upload");
    form.keepExtensions = true;//保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;
    //处理图片
    form.parse(req, function (err, fields, files){
        var filename = files.file.name
        var taskid = fields.taskid;
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length - 1];
        var name = '';
        for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        var date = new Date();
        var time = '_' + date.getFullYear() + "_" + date.getMonth() + 1 + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
        var imgName = name + time + '.' + type;
        var newPath = form.uploadDir + "/" + imgName;
        fs.renameSync(files.file.path, newPath);  //重命名
        // 关联到用户头像
        var sql = 'insert into taskimg(taskid, uid, img) values('+ taskid+ ',' + uid + ',"'+ imgName+'")'
        db.query(sql,function(err,rows){
            if(err){
                res.json({errcode: 0, datas: [], msg: '插上数据失败'});
            }else {
                db.query('SELECT MAX(id) as id FROM taskimg',function(err, rows){
                    if(err){

                    } else {                      
                        res.json({errcode: 0, msg: '上传成功', data:{img: imgName, id: rows[0].id}})  
                    }
                })
            }
        });
    })
});


router.post("/gettaskimg",function(req, res, next){
    var taskid = req.body.taskid;
    
    var token = req.header('authorization')
    var uid = jwtChange(token).userid
    
    var sql = "select id,img from taskimg where taskid = " + taskid + ' and uid=' + uid +' ORDER BY id DESC'
    db.query(sql, function(err, rows) {
        if (err) {
            res.json({errcode: 1, msg: "获取失败"+err});
        } else {
            res.json({errcode: 0, msg: '成功', data: rows});
        }
    });
});
router.post("/taskimgdel",function(req,res,next){
    var id = req.body.id;
    var token = req.header('authorization')
    var uid = jwtChange(token).userid
    var paths = './public/taskimg/upload/'+req.body.img
    if(paths.indexOf('./') !== 0){
        console.log(paths)
        return "为了安全仅限制使用相对定位..";
    }
    if(!fs.existsSync(paths)){
        console.log("路径不存在");
        return "路径不存在";
    }
    var info=fs.statSync(paths);
    if(info.isDirectory()){//目录
        // 只删除文件，不删除目录
        res.json({errcode:1,msg:"删除失败"+err});
        return
        var data=fs.readdirSync(paths);
        if(data.length>0){
            for (var i = 0; i < data.length; i++) {
                delPath(`${paths}/${data[i]}`); //使用递归
                if(i==data.length-1){ //删了目录里的内容就删掉这个目录
                    delPath(`${paths}`);
                }
            }
        }else{
            fs.rmdirSync(paths);//删除空目录
        }
    }else if(info.isFile()){
        fs.unlinkSync(paths);//删除文件

        db.query("delete from taskimg where id = " + id+' and uid='+uid,function(err,rows){
            if(err){
                res.json({errcode:1,msg:"删除失败"+err});
            }else {
                res.json({errcode:0,msg:'删除成功'});
            }
        });
    }
});
module.exports = router;
