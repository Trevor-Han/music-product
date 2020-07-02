$(function () {
    /*公共头部处理*/
    //1.监听头部输入框获取焦点
    $(".header-center-box>input").focus(function () {
        $(".header").addClass("active");
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
        $(".header").removeClass("active");
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
                          <img src="images/topbar-it666-search.png" alt="搜索">
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
    /*公共底部处理*/
    $(".footer").load("./../common/footer.html",function () {
        //当加载的内容添加后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    // 1.获取SVG路径的长度
    let length = $("#refreshLogo")[0].getTotalLength();
    // 2.默认先隐藏路径
    $("#refreshLogo").css({"stroke-dasharray": length});
    $("#refreshLogo").css({"stroke-dashoffset": length});
    // 3.创建IScroll
    let myScroll = new IScroll('.main', {
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
    // 4.监听滚动
    let logoHeight = $(".pull-down").height();
    let isPullDown = false;
    let isRefresh = false;
    /*
    由于IScroll中的数据都是从网络加载的, 所以一进来IScroll中没有数据, 所以一进来最大的滚动距离是0
    * */
    // console.log(myScroll.maxScrollY);
    myScroll.on("scroll", function () {
        if(this.y >= logoHeight){
            if(((this.y - logoHeight) * 3) <= length){
                // console.log("开始执行SVG动画");
                $("#refreshLogo").css({"stroke-dashoffset": length - (this.y - logoHeight) * 3});
            }else{
                // console.log("已经画完了");
                this.minScrollY = 170;
                isPullDown = true;
            }
        }
    });
    myScroll.on("scrollEnd", function () {
        if(isPullDown && !isRefresh){
            isRefresh = true;
            // 去网络上刷新数据
            refreshDown();
        }
    });
    function refreshDown() {
        setTimeout(function () {
            console.log("数据刷新完毕");
            isPullDown = false;
            isRefresh = false;
            myScroll.minScrollY = 0;
            myScroll.scrollTo(0, 0);
            $("#refreshLogo").css({"stroke-dashoffset": length});
        }, 3000);
    }

    /*创建首页的Banner*/
    HomeApis.getHomeBanner()
        .then(function (data) {
            let html = template('bannerSlide', data);
            $(".swiper-wrapper").html(html);
            new Swiper ('.swiper-container',{
                autoplay: {
                    delay: 1000,
                    disableOnInteraction: false,
                },
                loop: true, // 循环模式选项
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    bulletClass: 'my-bullet',
                    bulletActiveClass: 'my-bullet-active',
                },
                // 如果内容是从服务器获取的, 请加上这三个配置
                observer: true,
                observeParents: true,
                observeSlideChildren: true
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    /*创建首页导航*/
    $(".nav i").html(new Date().getDate());

    /*创建首页分区*/
    HomeApis.getHomeRecommend()
        .then(function (data) {
            data.title = "推荐歌单";
            data.subTitle = "歌单广场";
            data.result.forEach(function (obj) {
                obj.width=216/100;
                obj.playCount = formartNum(obj.playCount);
            });
            let html = template('category', data);
            $(".recommend").html(html);
            $(".recommend .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeExclusive()
        .then(function (data) {
            data.title = "独家放送";
            data.subTitle = "网易出品";
            data.result.forEach(function (obj, index) {
                obj.width=334/100;
                if(index === 2){
                    obj.width = 690/100;
                }
            });
            let html = template('category', data);
            $(".exclusive").html(html);
            $(".exclusive .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeAlbum()
        .then(function (data) {
            data.title = "新碟新歌";
            data.subTitle = "更多新碟";
            data.result = data["albums"];
            data.result.forEach(function (obj) {
                obj.artistName = obj.artist.name;
                obj.width=216/100;
            });
            let html = template('category', data);
            $(".album").html(html);
            $(".album .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            $(".album .category-singer").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeMV()
        .then(function (data) {
            data.title = "推荐MV";
            data.subTitle = "更多MV";
            data.result.forEach(function (obj, index) {
                obj.width=334/100;
            });
            let html = template('category', data);
            $(".mv").html(html);
            $(".mv .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            $(".mv .category-singer").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeDJ()
        .then(function (data) {
            data.title = "主播电台";
            data.subTitle = "更多主播";
            data.result.forEach(function (obj, index) {
                obj.width=216/100;
            });
            let html = template('category', data);
            $(".dj").html(html);
            $(".dj .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });
    function formartNum(num) {
        let res = 0;
        if(num / 100000000 > 1){
            let temp = num / 100000000 + "";
            if(temp.indexOf(".") === -1){
                res = num / 100000000 + "亿";
            }else{
                res = (num / 100000000).toFixed(1) + "亿";
            }
        }else if(num / 10000 > 1){
            let temp = num / 10000 + "";
            if(temp.indexOf(".") === -1){
                res = num / 10000 + "万";
            }else{
                res = (num / 10000).toFixed(1) + "万";
            }
        }else{
            res = num;
        }
        return res;
    }

    /*
    注意点:
    虽然我们是加载完数据才去刷新的, 但是数据中有图片, 并且高度依赖于图片, 所以哪怕是加载完数据才去刷新计算出来的高度也不对
    所以在企业开发中如果想拿到正确的滚动范围, 必须等到图片也加载完成再去刷新或者直接将高度写死
    * */
    /*
    setTimeout(function () {
        console.log(myScroll.maxScrollY);
        myScroll.refresh();
        console.log(myScroll.maxScrollY);
    }, 5000);
     */
});
