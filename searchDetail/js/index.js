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
    });
    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        //当加载的内容添加后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    $(".multiple-select").click(function () {
       $(".single-music>.top").addClass("active");
        $(".single-music>.bottom").addClass("active");
    });
    $(".complete-select").click(function () {
        $(".single-music>.top").removeClass("active");
        $(".single-music>.bottom").removeClass("active");
    });
    $(".check-all").click(function () {
        $(this).toggleClass("active");
        $(".single-music>.bottom>li").toggleClass("active");
    });
    SearchApis.getSearch(" 江南")
        .then(function (data) {
            let html = template('singleItem', data.result);
            $(".single-music>.bottom").html(html);
        })
        .catch(function (err) {
            console.log(err);
        })
});