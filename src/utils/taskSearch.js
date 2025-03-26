var db = require("../config/db.js");
var dateformatter = require("./dateFormatter.js");

var taskSearch = function (sql, uid, callBack) {
	var sql_label = 'SELECT o.id,q.id as labelitemsid,q.name,q.uid,q.theme from label q LEFT JOIN (' + sql + ') o on FIND_IN_SET(q.id,o.labelid) WHERE q.uid=' + uid;
	db.query('task',sql, function(err, rows){
	    if (err) {
	        callBack({errcode: 1, msg: '失败'});
	        return;
	    }else{
	        var okRows = rows;
	        if (okRows.length>0) {
	            for (var j = 0; j < okRows.length; j++) {
	                okRows[j].labellist = []
	            }
	        }else{
	        	callBack({errcode: 0, data :[], msg: '成功'});
	        	return;
	        }
	        db.query(sql_label, function(err, rows){
	            if (err) {
	                callBack({errcode: 1, msg: '失败'});
	            }else{
	                var labelRows = rows;
	                if(labelRows.length>0){
	                    for (var i = 0; i < labelRows.length; i++) {
	                        for (var j = 0; j < okRows.length; j++) {
	                            if (labelRows[i].id === okRows[j].id) {
	                                okRows[j].labellist.push(labelRows[i]);
	                            }
	                        }
	                    }
	                }
	                //okRows = dateformatter(okRows)
	                callBack({errcode: 0, data: okRows, msg: '成功'});
	                return;
	            }
	        });
	    }
	});
}
 
module.exports = taskSearch;