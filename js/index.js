var rows = 4, cols = 4;   // 默认游戏区域
var obj = {};  //记录雷位置
var count = 0;  //雷个数
var timer = null;  //初始化定时器
var start = true;   //是否开始
setTd(rows, cols);
// 获取下拉列表选项
$('#sel').on('change', function () {
    if ($(this).val() == '6') {
        $('.container .tab').html('');
        rows = 6;
        cols = 6;
        // setTd(6, 6);
    } else if ($(this).val() == '10') {
        $('.container .tab').html('');
        rows = 10;
        cols = 10;
        // setTd(10, 10);
    } else if ($(this).val() == '15') {
        $('.container .tab').html('');
        rows = 15;
        cols = 10;
        // setTd(15, 10);
    } else if ($(this).val() == '20') {
        $('.container .tab').html('');
        rows = 20;
        cols = 10;
        // setTd(20, 10);
    } else if ($(this).val() == '25') {
        $('.container .tab').html('');
        rows = 25;
        cols = 15;
        // setTd(25, 15);
    } else {
        $('.container .tab').html('');
        // 默认3*3个格子
        // setTd(4, 4);
        rows = 4;
        cols = 4;
    }
    setTd(rows, cols);
});
// 创建格子方块
function setTd(rows, cols) {
    for (var i = 0; i < cols; i++) {
        $('.container .tab').append('<ul></ul>');
        for (var j = 0; j < rows; j++) {
            $('.container .tab ul:eq(' + i + ')').append('<li></li>');
        }
    }
    // 设置地雷位置与样式
    setStyle(rows, cols);
}
// 获取随机位置方法
function getRandom(rows, cols, count) {
    var arr = [];
    var obj = {
        row: [],
        col: []
    }
    while (1) {
        // 判断重复的个数，有则创建随即对象，没有则跳出循环
        var length = count - obj.row.length;
        if (length) {
            for (var c = 0; c < length; c++) {
                // 预先创建length个随机数对象，并保存入数组
                var o = {};
                o.row = Math.floor(Math.random() * rows);
                o.col = Math.floor(Math.random() * cols);
                arr.push(o);
            }
            // 遍历获取到的随机对象数组，没有重复则添加入obj对象
            for (var i = 0; i < arr.length; i++) {
                if (obj.row.indexOf(arr[i].row) == -1 || obj.col.indexOf(arr[i].col) == -1) {
                    obj.row.push(arr[i].row);
                    obj.col.push(arr[i].col);
                }
            }
        } else {
            break;
        }
    }
    return obj;
}
// 设置雷的样式
function setStyle(rows, cols) {
    count = Math.floor(rows * cols / 16); //设置雷的个数，最小3*3个格子有一个雷;
    $('.count').text(count);
    obj = getRandom(rows, cols, count);
    for (var i = 0; i < count; i++) {
        var r = obj.row[i];
        var c = obj.col[i];
        $('.container .tab ul').eq(c).children("li").eq(r).addClass('isBong');
        // 添加自定义属性标记是否可以右键标记
        $('.container .tab ul').eq(c).children("li").eq(r).attr('data-index', 1);
    }
}
// console.log(obj);
var flag = true;  //判断是否能进行游戏
// 点击方块进行游戏
$('.container .tab').on('mouseup', $('.container .tab ul li'), function (e) {
    // 游戏结束则不能再进入
    if (flag) {
        // 第一次点击开始计时
        if (start) {
            residueTime();
            start = false;
        }
        // 判断是否点击到雷
        var target = $(e.target);
        var setCount = 0;
        for (var i = 0; i < obj.row.length; i++) {
            var r = obj.row[i];
            var c = obj.col[i];
            // 左键游戏
            if (e.which == 1) {
                if (!target.hasClass('active')) {
                    target.addClass('isCheck');
                    // 踩雷判断
                    if (target.parent().index() == c && target.index() == r) {
                        alert("cai踩到雷啦！");
                        clearInterval(timer);
                        result();
                        flag = false;
                    }
                    // 周围雷个数
                    // 判断周围雷个数
                    if (target.index() - 1 == r && target.parent().index() == c) { //上
                        setCount++;
                    } else if (target.index() == r && target.parent().index() - 1 == c) { //左
                        setCount++;
                    } else if (target.index() + 1 == r && target.parent().index() == c) { //下
                        setCount++;
                    } else if (target.index() == r && target.parent().index() + 1 == c) { //右
                        setCount++;
                    } else if (target.index() - 1 == r && target.parent().index() - 1 == c) { //左上
                        setCount++;
                    } else if (target.index() - 1 == r && target.parent().index() + 1 == c) { //右上
                        setCount++;
                    } else if (target.index() + 1 == r && target.parent().index() - 1 == c) { //左下
                        setCount++;
                    } else if (target.index() + 1 == r && target.parent().index() + 1 == c) { //右下
                        setCount++;
                    }
                    setCount = setCount == 0 ? '' : setCount;
                    target.text(setCount);
                }
            }
            // 点击右键
            if (e.which == 3) {
                if (!target.hasClass('isCheck')) {
                    target.toggleClass('active');
                    if (target.parent().index() == c && target.index() == r) {
                        // 根据自定义属性判断是否减
                        if (target.attr('data-index') == 1) {
                            count--;
                            target.attr('data-index', 0);
                        }
                        if (count == 0) {
                            alert('游戏结束');
                            clearInterval(timer);
                            result();
                            flag = false;
                        }
                    }
                }
            }
            $('.count').text(count);
        }
    }
});
// 阻止浏览器默认右键选项菜单
$('.container').on('contextmenu', function () {
    return false;
});
// 设置定时器,计算时间
function residueTime() {
    clearInterval(timer);
    var second = 0;
    var minute = 0;
    var hour = 0;
    timer = setInterval(function () {
        minute = minute == 0 ? "00" : minute;
        hour = hour == 0 ? "00" : hour;
        second++;
        if (second == 60) {
            second = 0;
            minute++;
            minute = minute < 10 ? "0" + minute : minute;
        }
        if (minute == 60) {
            minute = 0;
            hour++;
            hour = hour < 10 ? "0" + hour : hour;
        }
        second = second < 10 ? "0" + second : second;
        $('.second').text(second);
        $('.minute').text(minute);
        $('.hour').text(hour);
    }, 1000);
}
function result() {
    var txt = $('.result-box p').text();
    var hour = $('.hour').text();
    var minute = $('.minute').text();
    var second = $('.second').text();
    hour = hour == '00' ? '' : hour + "小时";
    minute = minute == '00' ? '' : minute + "分钟";
    second = second == '00' ? '' : second + "秒";
    var str = txt + hour + minute + second;
    $('.result-box p').text(str);
    $('.mask').show();
}
// 再来一次
$('.result-box button').on('click', function () {
    location.href = 'index.html'; s
});