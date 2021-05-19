$(window).resize(resize);


function resize(){
    $('.mapBox').width($(window).width());

    $('.search-page').width($('.mapBox').width());
    $('.search-page').height($('.mapBox').height());

    $('.act-layer').width($('.search-page').width());
    $('.act-layer').height($('.search-page').height());

    $('.menu-right').height($('.act-layer').height()-50);
    $(".compare-box").width($('.mapBox').width()-350);
    $(".compare-box").height($('.mapBox').height()-200);

};

$(document).ready(function(){
    var map = addMap();

});
