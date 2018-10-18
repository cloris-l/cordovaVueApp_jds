import dayjs from 'dayjs'
let Common = {
    //获取当前月份以前的n个月
    getMonthbeforeNow(length, hasYear, hasZero) {
        let a = [];
        let y = new Date().getFullYear()
        let m = new Date().getMonth() + 1;
        for (let i = length - 1; i >= 0; i--) {
            if (m == 1) {
                m = 13;
                y = +y - 1;
            }
            m = +m - 1;
            if (hasZero) {
                if (m.toString().length < 2) {
                    m = '0' + m;
                }
            }
            if (hasYear) {
                a[i] = `${y}-${m}`;
            } else {
                a[i] = m
            }

        }
        return a;
    },
    //两个时间段 相差的 n 月，return n
    getMonthbetweenNum(startDate, endDate) {
        let startTime = new Date(startDate)
        let endTime = new Date(endDate)
        let differMonth = (dayjs(endTime).format("YYYY") - dayjs(startTime).format("YYYY")) * 12 +
            (dayjs(endTime).format("MM") - dayjs(startTime).format("MM"))
        return differMonth
    },
    getWeekArr(length) { //获取过去几天的数组（不包括今天）           
        let myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - (length - 1));
        let dateArray = [];
        let dateTemp;
        let flag = 1;
        for (let i = 0; i < length; i++) {
            dateTemp = (myDate.getFullYear()) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
            dateArray.push({ name: dateTemp, id: dateTemp });
            myDate.setDate(myDate.getDate() + flag);
        }
        return dateArray
    },
    chartxAxis(startTime, endTime, type) {
        let start = dayjs(startTime.replace(/-/g, "/")).valueOf();
        let end = dayjs(endTime.replace(/-/g, "/")).valueOf();
        let arr = []
        while (start <= end) {
            if (type == 'h') {
                arr.push(dayjs(start).format('HH:mm'))
                start = start + 60 * 60 * 1000;
            } else if (type == 'm') {
                arr.push(dayjs(start).format('HH:mm'))
                start = start + 60 * 5 * 1000;
            }
        }
        return arr
    },
    chartData(dataArr) {
        let arr = [];
        if (dataArr instanceof Array && dataArr.length > 0) {
            dataArr.forEach(item => {
                let x = dayjs(item.timestamp.replace(/-/g, "/")).valueOf();
                arr.push([dayjs(x).format('HH:mm'), item.value])
            })
        }
        return arr
    }
}
window.Common = Common;
Array.prototype.contains = function(needle) {
    for (var i in this) {
        if (this[i] == needle) return i;
    }
    return false;
};
Array.prototype.max = function() {
    // 将数组第一个元素的值赋给max 
    var max = this[0]; // 使用for 循环从数组第一个值开始做遍历 
    for (var i = 1; i < this.length; i++) { // 如果元素当前值大于max,就把这个当前值赋值给max 
        if (this[i] > max) { max = this[i]; }
    } // 返回最大的值 
    return max;
}