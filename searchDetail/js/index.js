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
       $(".nav>ul>span").animate({left: this.offsetLeft, width: this.offsetWidth},400);
    });
    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        //当加载的内容添加后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });
});