/* eslint-disable */
function addZero(v, size) {
  for (var i = 0, len = size - (v + "").length; i < len; i++) {
    v = "0" + v;
  };
  return v + "";
}
/**
 * js 时间戳的转换（自定义格式）
 * @param  date [创建 Date 对象]
 * @param  formatStr [日期格式]
 * @return (string) 日期时间
 */
// formatDate(new Date(1533686888*1000),"YYYY-MM-DD HH:ii:ss");
export function formatDate(date, formatStr) {
  var arrWeek = ['日', '一', '二', '三', '四', '五', '六'],
    str = formatStr.replace(/yyyy|YYYY/, date.getFullYear()).replace(/yy|YY/, addZero(date.getFullYear() % 100, 2)).replace(/mm|MM/, addZero(date.getMonth() + 1, 2)).replace(/m|M/g, date.getMonth() + 1).replace(/dd|DD/, addZero(date.getDate(), 2)).replace(/d|D/g, date.getDate()).replace(/hh|HH/, addZero(date.getHours(), 2)).replace(/h|H/g, date.getHours()).replace(/ii|II/, addZero(date.getMinutes(), 2)).replace(/i|I/g, date.getMinutes()).replace(/ss|SS/, addZero(date.getSeconds(), 2)).replace(/s|S/g, date.getSeconds()).replace(/w/g, date.getDay()).replace(/W/g, arrWeek[date.getDay()])
  return str
}