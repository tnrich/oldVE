$(".footer, .push").height($(".footer .row").height()+"px");
$(".wrapper").css({'margin-bottom':(-1*$(".footer .row").height())+"px"});
window.onresize = function(){
    $(".footer, .push").height($(".footer .row").height()+"px");
    $(".wrapper").css({'margin-bottom':(-1*$(".footer .row").height())+"px"});
}