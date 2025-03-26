var moment = require('moment');
var dateformatter = function (alldate) {
    for (var i = alldate.length - 1; i >= 0; i--) {
        if(alldate[i].plantime==null){
            alldate[i].plantime = '';
        }else{
            alldate[i].plantime = moment(alldate[i].plantime).format('YYYY-MM-DD');
        }
        alldate[i].time = moment(alldate[i].time).format('YYYY-MM-DD HH:mm:ss');
    
        alldate[i].edittime = moment(alldate[i].edittime).format('YYYY-MM-DD HH:mm:ss');
    
        alldate[i].completetime = moment(alldate[i].completetime).format('YYYY-MM-DD');
    }
    return alldate;
}

module.exports = dateformatter;