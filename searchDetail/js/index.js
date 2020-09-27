$(function () {
    /*公共头部处理*/
    let oUlWidth = 0;
    $(".nav>ul>li").forEach(function (oLi) {
       oUlWidth += oLi.offsetWidth;
    });

    let navPaddingRight = parseFloat(getComputedStyle($(".nav")[0]).paddingRight);
    $(".nav>ul").css({width:oUlWidth + navPaddingRight});

    let navScroll = new IScroll(".nav",{
        mouseWheel:false,
        scrollbars:false,
        scrollX:true,
    });
    $(".nav>ul>span").css({width: $(".nav>ul>li")[0].offsetWidth});
    $(".nav>ul>li").click(function () {
        //计算偏移位
        let offsetX = $(".nav").width() / 2 - this.offsetLeft - this.offsetWidth / 2;
      /*  console.log(offsetX);
        console.log(navScroll.x);
        console.log(navScroll.maxScrollX);*/
      if (offsetX > 0){
          offsetX = 0;
      }else if(offsetX < navScroll.maxScrollX){
          offsetX = navScroll.maxScrollX;
      }
      //让导航条滚动
        navScroll.scrollTo(offsetX,0,400);
      //设置选中状态
        $(this).addClass("active").siblings().removeClass("active");
        $(".main-in>div").removeClass("active").eq($(this).index()).addClass("active");
       $(".nav>ul>span").animate({left: this.offsetLeft, width: this.offsetWidth},400);
        myScroll.refresh();
    });

    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        //当加载的内容添加后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    //初始化上拉加载更多
    let myScroll = new IScroll(".main",{
        mouseWheel: false,
        scrollbars: false,
        probeType:3
    });
    let isRefresh = false;
    let isPullUp = false;
    myScroll.on("scroll",function () {

        //处理上拉加载更多
        // console.log(this.y,myScroll.maxScrollY);
        //看到上拉加载更多时
        if (this.y <= myScroll.maxScrollY){
            $(".pull-up>p>span").html("松手加载更多");
            isPullUp = true;
        }
    });
    //监听松手后事件
    myScroll.on("scrollEnd",function () {
        if (isPullUp && !isRefresh){
            $(".pull-up>p>span").html("加载中...");
            isRefresh = true;
            //去刷新数据
            refreshUp();
        }
    });

    let offset = 0;
    let limit = 30;
    function refreshUp() {
        //播放列表数据加载默认数据
        offset += limit;
        SearchApis.getSearch("江南",offset)
            .then(function (data) {
                // console.log(data);
                if (data.result.songs) {
                    let html = template("songItem", data.result);
                    $(".main-in>.song>.list").append(html);
                }

                isPullUp = false;
                isRefresh = false;
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    /*    //本地超时测试
        setTimeout(function () {
            myScroll.scrollTo(0,myScroll.maxScrollY + $(".pull-up").height());
        },3000);*/
    }

    //初始化单曲播放界面
    initSong();
    function initSong() {
        //监听多选按钮点击
        $(".multiple-select").click(function () {
            $(".main-in>.song>.top").addClass("active");
            $(".main-in>.song>.list").addClass("active");
        });
        //监听完成按钮点击
        $(".complete-select").click(function () {
            $(".main-in>.song>.top").removeClass("active");
            $(".main-in>.song>.list").removeClass("active");
        });
        //监听全选按钮点击
        $(".check-all").click(function () {
            $(this).toggleClass("active");
            $(".main-in>.song>.list>li").toggleClass("active");
        });
        // 处理单曲界面头部
        myScroll.on("scroll",function () {
            // 处理单曲头部
            if(this.y < 0){
                $(".main-in>.song>.top").css({top: -this.y});
            }else {
                $(".main-in>.song>.top").css({top: 0});
            }
        });
        //播放列表数据加载默认数据
        SearchApis.getSearch("江南")
            .then(function (data) {
                // console.log(data);
                let html = template("songItem", data.result);
                $(".main-in>.song>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    //初始化单曲视频播放界面
    initVideo();
    function initVideo() {

    }
});