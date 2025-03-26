var express = require('express');
var router = express.Router();
var moment = require('moment');
var formidable = require('formidable');
var path = require("path");
var fs = require('fs');
var jwtChange = require('../../utils/jwtchange.js');



var db = require("../../config/db.js");
var dateformatter = require("../utils/dateFormatter.js");

/**
 * 登录页
 */

/**
 * 工作记录页
 */

router.get("/",function(req,res,next){
    // var token = req.header('authorization');
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    var uid = tokenData.userid;
    db.query("select * from user where id=2",function(err,rows){
        if(err){
            res.render("worklist",{title:"工作记录",datas:[]});
        }else {
            res.render("worklist",{title:"工作记录",datas:rows});
        }
    });
});

router.get("/items",function(req,res,next){
    var token = req.cookies.token;
    var tokenData = req.session.tokenData;
    
    db.query("select * from worklist where uid="+tokenData.userid+" order by time desc",function(err,rows){
        if(err){
            res.json({title:"用户列表",data:{total:0,rows:[]}});
        }else {
            res.json({title:'工作记录',data:{total:rows.length,rows:rows}});
        }
    }); 
    
});
router.get("/order",function(req,res,next){
    /*var token = req.cookies.token;
    var tokenData = req.session.tokenData;*/

    var token = req.header('authorization');
    var tokenData = jwtChange(token);

    var startTime = moment().format('YYYY-MM-DD')
    var endTime = moment().format('YYYY-MM-DD')


    var orderlist = [],
        labellist = [],
        today = 0,
        week = 0,
        inbox = 0,
        complete = 0,
        trash = 0,
        leftbar = [];
        var sql_order = 'SELECT e.*,ifnull(d.count,0) as count FROM orderlist e '+
                'left join (select a.id,count(b.orderid) as count from orderlist a left join task b on b.orderid=a.id left join user c on c.id = a.uid where a.uid='+tokenData.userid+' and b.status=0 and b.delstatus=0 group by b.orderid,a.id) d '+
                'on d.id=e.id '+
                'where e.uid='+tokenData.userid;

        var sql_label = 'SELECT e.*,ifnull(d.count,0) as count FROM label e LEFT JOIN (select a.id,count(b.labelid) as count from label a left join task b on FIND_IN_SET(a.id,b.labelid) left join user c on c.id = a.uid where a.uid='+tokenData.userid+' and b.status=0 and b.delstatus=0 group by b.labelid,a.id) d on d.id=e.id where e.uid='+tokenData.userid;

        db.query('select * from task where "'+startTime+'">plantime and status=0 and delstatus=0 and uid='+tokenData.userid,function(err,rows){
            // 已过期
            let overdue = rows.length;
            console.log('over:'+overdue)
            db.query(sql_order,function(err,rows){
                if(err){
                    res.json({title:"清单列表",data:{total:0,rows:[]}});
                }else {
                    orderlist = rows;
                    for(let i=0;i<orderlist.length;i++){
                        orderlist[i].time = moment(new Date(orderlist[i].time)).format('YYYY-MM-DD HH:mm:ss');
                    }
                    db.query(sql_label, function(err, rows) {
                        if(err) {

                        }else{
                            labellist = rows;
                            for(let i=0;i<labellist.length;i++){
                                labellist[i].time = moment(new Date(labellist[i].time)).format('YYYY-MM-DD HH:mm:ss');
                            }
                            db.query('select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and "'+endTime+'">=plantime and plantime>="'+startTime+'"',function(err,rows){
                                // 今天count
                                if(err){

                                }else{
                                    today = rows.length;
                                    console.log('今天'+today)
                                    let startDate = moment().format('YYYY-MM-DD'),
                                        endDate = moment().add(6, 'days').format('YYYY-MM-DD');

                                    db.query('select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and plantime >="'+startDate+'"'+' and plantime<="'+endDate+'"',function(err,rows){
                                        // 七天count
                                        if(err){

                                        }else{
                                            week = rows.length;
                                            db.query('select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid is null',function(err,rows){
                                                // 收集箱count
                                                if(err){

                                                }else{
                                                    inbox = rows.length;
                                                    
                                                    db.query('select * from task where uid='+tokenData.userid+' and status=1 and delstatus=0',function(err,rows){
                                                        // 已完成count
                                                        if(err){

                                                        }else{
                                                            complete = rows.length;
                                                            db.query('select * from task where uid='+tokenData.userid+' and delstatus=1',function(err,rows){
                                                                // 已删除
                                                                if(err){

                                                                }else{
                                                                    trash = rows.length;
                                                                    db.query('SELECT * FROM menu a LEFT JOIN usermenu b ON a.id = b.menu_id WHERE b.uid='+tokenData.userid,function(err,rows){
                                                                        // leftbar
                                                                        if(err){

                                                                        }else{
                                                                            leftbar = rows;
                                                                            db.query('select DISTINCT groups from menu',function(err,rows){
                                                                                var group = rows;
                                                                                var arr = {};
                                                                                for(var i=0;i<group.length;i++){
                                                                                    arr['group'+i] = [];
                                                                                    for(var j=0;j<leftbar.length;j++){
                                                                                        if(group[i].groups==leftbar[j].groups){
                                                                                            if(leftbar[j].key=='all'){
                                                                                                leftbar[j].count = '10'
                                                                                            }else if (leftbar[j].key=='today') {
                                                                                                leftbar[j].count = today+overdue;
                                                                                            }else if (leftbar[j].key=='week') {
                                                                                                leftbar[j].count = week+overdue;
                                                                                                
                                                                                            }else if (leftbar[j].key=='inbox') {
                                                                                                
                                                                                                leftbar[j].count = inbox;
                                                                                            }else if (leftbar[j].key=='complete') {
                                                                                                
                                                                                                leftbar[j].count = complete;
                                                                                            }else if (leftbar[j].key=='trash') {
                                                                                                
                                                                                                leftbar[j].count = trash;
                                                                                            }
                                                                                            arr['group'+i].push(leftbar[j]);
                                                                                        }

                                                                                    }

                                                                                    arr['orderlist'] = orderlist;

                                                                                    arr['labellist'] = labellist;
                                                                                }
                                                                                res.json({errcode:0,msg:'成功',title:'工作记录',groupObj:arr});

                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });                
                                                        }
                                                    });              
                                                }
                                            });
                                        }
                                    });               
                                }
                            })
                        }
                        
                    })
                }
            });
            
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

router.post("/tasks",function(req,res,next){
    var token = req.header('authorization');
    var tokenData = jwtChange(token);
    let type = req.body.parma,
    orderid = req.body.orderid || '';
    name = req.body.name
        
    let startToday = moment().format('YYYY-MM-DD') +' 00:00:00',
        endToday = moment().format('YYYY-MM-DD') + ' 23:59:59';

    if(!tokenData || !token){
        res.redirect('/login');  // 将用户重定向到登录页面
        return;
    }

    let overdue = {title:'已过期',data:[]},        // 已过期
        noplantime = {title:'无日期',data:[]},     // 无日期
        complete = {title:'已完成',data:[]},       // 已完成
        todays = {title:'今天',data:[]},         // 今天
        future = {title:'未来',data:[]},           // 未来的
        trash = {title:'垃圾桶',data:[]};          // 垃圾桶
        orderlist = {title:'清单',data:[]};          // 垃圾桶
        labellist = {title:'标签',data:[]};          // 垃圾桶



    /**
     * [sqloverdue 先查出]
     * @type {String}
     */
    let sql_overdue = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                      'left join orderlist a on a.id=b.orderid where "'+startToday+'">b.plantime and b.status=0 and b.delstatus=0 and b.uid='+tokenData.userid;

    

    let sql_nodate = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                     'left join orderlist a on a.id=b.orderid where b.uid='+tokenData.userid+' and b.status=0 and b.delstatus=0 and b.plantime is null';

    let sql_today = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                    'left join orderlist a on a.id=b.orderid where b.uid='+tokenData.userid+' and b.status=0 and b.delstatus=0 and "'+ startToday+'"<=b.plantime and b.plantime<="'+endToday+'" order by b.plantime desc';

    let sql_week = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                   'left join orderlist a on a.id=b.orderid where b.uid='+tokenData.userid+' and b.status=0 and b.delstatus=0 and b.plantime >= DATE_SUB(CURDATE(),INTERVAL 6 DAY) order by b.plantime desc';

    let sql_future = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                     'left join orderlist a on a.id=b.orderid where b.uid='+tokenData.userid+' and b.status=0 and b.plantime>"'+startToday+'"'

    let sql_inbox = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid is null order by plantime desc';


    if(type=='inbox'){

        sql_overdue = 'select * from task where "'+startToday+'">plantime and status=0 and delstatus=0 and orderid is null and uid='+tokenData.userid;

        sql_nodate = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid is null and plantime is null order by time desc';

        sql_today = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid is null and "'+ startToday+'"<=plantime and plantime<="'+endToday+'" order by plantime desc';

        sql_week = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid is null and plantime >= DATE_SUB(CURDATE(),INTERVAL 6 DAY) order by plantime desc';
    
        sql_future = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid is null and plantime>"'+startToday+'"'

    }
    db.query(sql_overdue,function(err,rows){
        // 已过期
        let sql_label = 'SELECT p.id,q.id as labelitemid,q.name,q.theme,q.uid from task p LEFT JOIN ('+sql_overdue+') o on p.id=o.id LEFT JOIN label q on FIND_IN_SET(q.id,p.labelid) WHERE q.uid='+tokenData.userid;
        let rowArr = rows;
        overdue.data = rowArr;
        db.query(sql_nodate,function(err,rows){
            // 无日期
            var rowArr = rows;
            noplantime.data = rowArr;
            db.query(sql_future, function(err,rows){
                //未来
                let rowArr = rows;
                future.data = rowArr;
                
                db.query(sql_today,function(err,rows){
                    // 今天的
                    if(err){
                        res.json({title:"工作任务",msg:err,errcode:1});
                    }else {
                        let rowArr = rows;
                        todays.data = rowArr;
                        switch(type) {
                             case 'today':
                                // 今天
                                // 小于等于今天的数据
                                let sql_today = 'select b.id,b.name,b.detail,b.orderid,b.labelid,b.time,b.plantime,b.edittime,b.completetime,b.uid,b.level,b.delstatus,b.status,a.name as ordername,a.theme from task b '+
                    'left join orderlist a on a.id=b.orderid where b.uid='+tokenData.userid+' and b.status=0 and b.delstatus=0 and "'+ startToday+'">=b.plantime order by b.plantime desc';
                                // 
                                // 
                                // 
                                // 
                                // 
                                // 
                                noplantime.data = [];   // 无日期的置空
                                future.data = [];       // 未来的置空
                                orderlist.data = [];    // 清单的置空
                                labellist.data = [];
                                let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                alldate = dateformatter(alldate)
                                res.json({errcode:0,data:alldate,msg:'成功'})
                                break;
                             case 'week':
                                // 七天
                                
                                future.data = [];
                                noplantime.data = [];
                                orderlist.data = [];
                                labellist.data = [];

                                db.query(sql_week,function(err,rows){
                                    if(err){
                                        res.json({title:"工作任务",msg:err,errcode:1});
                                    }else {
                                        let rowArr = rows;
                                        for(let i=0;i<rowArr.length;i++){
                                            let plantime = moment(new Date(rowArr[i].plantime)).format('YYYY-MM-DD HH:mm:ss')
                                            if(plantime>endToday){
                                                future.data.push(rowArr[i]);
                                            }
                                        }
                                        let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                        alldate = dateformatter(alldate)
                                        res.json({errcode:0,data:alldate,msg:'成功'})
                                    }
                                });
                                break;
                            case 'calendar':
                                // 日历
                                let sql = 'select * from task order by plantime desc';
                                break;
                            case 'inbox':
                                // 收集箱
                                orderlist.data = [];
                                labellist.data = [];
                                db.query(sql_inbox, function(err,rows){
                                    if(err){
                                        res.json({title:"工作任务",msg:err,errcode:1});
                                    }else {
                                        let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                        alldate = dateformatter(alldate)
                                        res.json({errcode: 0, data: alldate, msg: '成功'})
                                    }
                                });
                                
                                break;
                            case 'complete':
                                // 已完成
                                let sql_complete = 'select a.*,b.name as ordername,b.display from task a left join orderlist b on b.id=a.orderid where a.uid='+tokenData.userid+' and status=1 and delstatus=0 order by a.plantime desc';
                                noplantime.data = [];
                                future.data = [];
                                overdue.data = [];
                                todays.data = [];
                                trash.data = [];
                                orderlist.data = [];
                                labellist.data = [];
                                db.query(sql_complete,function(err,rows){
                                    if(err){
                                        res.json({title:"工作任务",msg:err,errcode:1});
                                    }else {
                                        let rowArr = rows;
                                        complete.data = rowArr
                                        let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                        alldate = dateformatter(alldate)
                                        res.json({errcode:0,data:alldate,msg:'成功'})
                                    }
                                });
                                break;
                            case 'trash':
                                // 垃圾桶
                                let sql_trash = 'select * from task where uid='+tokenData.userid+' and delstatus=1 order by plantime desc';
                                noplantime.data = [];
                                future.data = [];
                                overdue.data = [];
                                todays.data = [];
                                complete.data = [];
                                orderlist.data = [];
                                labellist.data = [];
                                db.query(sql_trash,function(err,rows){
                                    if(err){
                                        res.json({title:"工作任务",msg:err,errcode:1});
                                    }else {
                                        let rowArr = rows;
                                        trash.data = rowArr
                                        let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                        alldate = dateformatter(alldate)
                                        res.json({errcode:0,data:alldate,msg:'成功'})
                                    }
                                });
                                break;
                            case 'abstract':
                                // 摘要
                                sql = 'select * from task order by plantime desc';
                                break;
                            case 'orderlist':
                                // 清单的
                                let sql_orderlistsql = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and orderid='+orderid+' order by plantime desc';
                                noplantime.data = [];
                                future.data = [];
                                overdue.data = [];
                                todays.data = [];
                                complete.data = [];
                                labellist.data = [];
                                db.query(sql_orderlistsql, function(err,rows){
                                    if(err){
                                        res.json({title:"工作任务",msg:err,errcode:1});
                                    }else {
                                        let rowArr = rows;
                                        orderlist.data = rowArr;
                                        let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                        alldate = dateformatter(alldate)
                                        res.json({errcode:0,data:alldate,msg:'成功'})
                                    }
                                });
                                break;
                            case 'labellist':
                                // 清单的
                                let sql_labellistsql = 'select * from task where uid='+tokenData.userid+' and status=0 and delstatus=0 and find_in_set("'+name+'",labelid) order by plantime desc';
                                noplantime.data = [];
                                future.data = [];
                                overdue.data = [];
                                todays.data = [];
                                complete.data = [];
                                orderlist.data = [];
                                db.query(sql_labellistsql, function(err,rows){
                                    if(err){
                                        res.json({title: "工作任务", msg: err, errcode: 1});
                                    }else {
                                        let rowArr = rows;
                                        labellist.data = rowArr;
                                        let alldate = {todays:todays,complete:complete,overdue:overdue,noplantime:noplantime,future:future,trash:trash,taskorderlist:orderlist,tasklabellist:labellist};
                                        alldate = dateformatter(alldate)
                                        res.json({errcode:0,data:alldate,msg:'成功'})
                                    }
                                });
                                break;
                             default:
                        }  
                    }
                }); 
            });
        });
    });

    
    
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
            db.query("select * from task where uid="+uid,function(err,rows){
                if(err){
                    res.json({errcode: 1,msg: "新增失败"+err});
                }else {
                    var row = rows[rows.length-1];
                    row.time = moment(new Date(row.time)).format('YYYY-MM-DD HH:mm:ss');
                    res.json({errcode: 0,msg: '成功',rows: row});
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
