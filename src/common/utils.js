export function
    debounce(func, delay) {
    let timer = null; //timer也是个局部变量，但是没有被销毁，因为内部的函数引用了它，形成闭包
    return function (...args) {
        //...argus是可以接收多个参数
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args); //apply可以改变this指向，否则this指向window
        }, delay);
    };
}

// 时间格式 P200集有具体讲看懂这个
export function formatDate(date, format) {
    // 获取年份
    // y+  匹配检查输入的1个或多个y
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    //2.获取

    var o = {
        "M+": date.getMonth() + 1, // montdateh
        "d+": date.getDate(), // day
        "h+": date.getHours(), // hour
        "m+": date.getMinutes(), // minute
        "s+": date.getSeconds(), // second
        "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
        "S": date.getMilliseconds()
        // millisecond
    }

    for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            let str = o[k] + '';
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? str : padLeftZero(str))
        }
    }
    return format;
};
function padLeftZero(str) {
    return ("00" + str).substr(str.length)
}
