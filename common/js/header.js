$(function () {
    //1.监听头部输入框获取焦点
    $(".header-center-box>input").focus(function () {
        $(".header-in").addClass("active");
        $(".header-container").show();
        //2.处理搜索历史(获取焦点时就添加到current-bottom>li里)
        $(".current-bottom>li").remove();
        let historyArray = getHistory();
        if (historyArray.length === 0){
            $(".search-history").hide();
        }
        else {
            $(".search-history").show();
            historyArray.forEach(function (item) {
                let oLi = $("<li>"+item+"</li>")
                $(".history-bottom").append(oLi);
            });
        }
        searchScroll.refresh();
    });
    //2.箭头头部输入框失去焦点
    $(".header-center-box>input").blur(function () {
        // console.log(this.value);
        if(this.value.length === 0){
            return;
        }
        let historyArray = getHistory();
        historyArray.unshift(this.value);
        this.value = "";
        localStorage.setItem("history",JSON.stringify(historyArray));
    });
    //3.取消按钮点击事件
    $(".header-cancle").click(function () {
        $(".header-in").removeClass("active");
        $(".header-container").hide();
        //取消时还原回搜索界面
        $(".header-center-box>input")[0].oninput();
    });
    //4.箭头头部开关
    $(".header-switch>span").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".header-switch>i").animate({left: this.offsetLeft}, 100);
    });
    //1.关闭广告
    $(".search-ad>span").click(function () {
        $(".search-ad").remove();
    });
    //2.监听搜索界面清空历史记录
    $(".history-top>img").click(function () {
        localStorage.removeItem("history");
        $(".search-history").hide();
    });
    function getHistory(){
        let historyArray = localStorage.getItem("history");
        if(!historyArray){
            historyArray = [];
        }else {
            historyArray = JSON.parse(historyArray);
        }
        return historyArray;
    }
    //3.处理热搜榜
    HomeApis.getHomeHotDetail()
        .then(function (data) {
            let html = template('hotDetail',data);
            $(".hot-bottom").html(html);
            searchScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        })
    //4.创建滚动
    let searchScroll = new IScroll('.header-container', {
        mouseWheel: false,
        scrollbars: false,
        /*
        需要使用iscroll-probe.js才能生效probeType：
        1  滚动不繁忙的时候触发
        2  滚动时每隔一定时间触发
        3  每滚动一像素触发一次
        * */
        probeType: 3,
    });
    //5.处理相关搜索界面
    $(".header-center-box>input")[0].oninput = throttle(function () {
        //没有输入数据时
        if(this.value.length === 0){
            $(".search-ad").show();
            // $(".search-history").show();
            $(".search-hot").show();
            $(".search-current").hide();
        }else {
            $(".search-ad").hide();
            $(".search-history").hide();
            $(".search-hot").hide();
            $(".search-current").show();
            HomeApis.getHomeSearchSuggest(this.value)
                .then(function (data) {
                    //输入文字时清除之前的li
                    $(".current-bottom>li").remove();
                    //遍历文档
                    data.result.allMatch.forEach(function (obj) {
                        let oLi = $(` 
                           <li>
                          <img src="./../common/images/topbar-it666-search.png" alt="搜索">
                          <p>${obj.keyword}</p>
                        </li>`);
                        $(".current-bottom").append(oLi);
                        searchScroll.refresh();
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        //搜索内容变成输入数据
        $(".current-top").text(`搜索"${this.value}"`);
        searchScroll.refresh();
    },1000);
});