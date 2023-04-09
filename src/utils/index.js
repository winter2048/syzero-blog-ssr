const initDate = (oldDate, full) => {
  var odate = new Date(oldDate);
  var year = odate.getFullYear();
  var month = odate.getMonth() < 9 ? '0' + (odate.getMonth() + 1) : odate.getMonth() + 1;
  var date = odate.getDate() < 10 ? '0' + odate.getDate() : odate.getDate();
  if (full == 'all') {
    //var t = oldDate.split(" ")[0];
    //console.log(oldDate, t.split('-')[0], t.split('-')[1], t.split('-')[2]);
    return year + '年' + month + '月' + date + '日';
  } else if (full == 'year') {
    return year
  } else if (full == 'month') {
    return odate.getMonth() + 1
  } else if (full == 'date') {
    return date
  } else if (full == 'newDate') {
    return year + '年' + month + '月' + date + '日';
  } else {
    var o = {
      "M+": odate.getMonth() + 1,                 //月份 
      "d+": odate.getDate(),                    //日 
      "h+": odate.getHours(),                   //小时 
      "m+": odate.getMinutes(),                 //分 
      "s+": odate.getSeconds(),                 //秒 
      "q+": Math.floor((odate.getMonth() + 3) / 3), //季度 
      "S": odate.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(full)) {
      full = full.replace(RegExp.$1, (odate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(full)) {
        full = full.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return full;
  }
}

export {

  initDate//设置时间

}
