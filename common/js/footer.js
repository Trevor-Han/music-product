$(function () {
    let pageArray = ["home", "video", "me", "friend", "account"];
    $(".footer-in>ul>li").click(function () {
        // 切换底部图标
        $(this).addClass("active").siblings().removeClass("active");
        let url = $(this).find("img").attr("src");
        url = url.replace("normal", "selected");
        $(this).find("img").attr("src", url);
        $(this).siblings().find("img").forEach(function (oImg) {
            oImg.src = oImg.src.replace("selected", "normal");
        });
        // 切换头部样式
        let currentName = pageArray[$(this).index()];
        $(".header-in").removeClass().addClass("header-in "+ currentName);
        //切换界面
        window.location.href = "./../"+currentName+"/index.html#"+currentName;
    });
   let hashStr = window.location.hash.substr(1);
   if(hashStr.length ===0){
       $(".home").click();
   }else {
       $("."+hashStr).click();
   }
});