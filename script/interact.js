$(".form-search").on('keypress',function(e) {
  if(e.which == 13) {
    var adr = $(this).val().toLowerCase();

    data_adr['features'].forEach(function(e) {
      var search_txt = e['properties']['search_txt'];

      if(search_txt){
        search_txt = search_txt.toLowerCase();

        if(search_txt.includes(adr)){
          var adr_lbl=e['properties']['street_name']+' '+e['properties']['street_number'];

          $(".adr-table").append(
            `
            <div class="row">
              <div class="col-12">
                <a class="font-weight-bold">${adr_lbl}</a>
              </div>
            </div>
            `
          );

          L.geoJSON(e).addTo(map);

        };

      };

    });

    $(".search-page").fadeOut("slow");
    $(".right-menu-top").fadeIn("slow");
    $(".left-menu-top").fadeIn("slow");

  };
});


$(".btn-menu").click(function(){
  var menu = $(this).parents().eq(1).attr('class');

  if(!$(this).hasClass("disabled")){
    $(".btn-menu").each(function(){

      if($(this).parents().eq(1).attr('class')===menu){
        $(this).removeClass("btn-menu-selected");
      };

    });

    if($(this).is("#btn-explore")){
      $(".right-menu-bottom").fadeIn("slow");
    };

  if(menu==='right-menu-bottom' && !$(this).hasClass(".btn-dist")){
    $(".data-box").each(function(){$(this).fadeOut("slow")});

    $(this).siblings().fadeIn("slow");
  };

    $(this).toggleClass("btn-menu-selected");
  };
});


$(".btn-dist").click(function(){
  $(".btn-dist").each(function(){
    $(this).removeClass("btn-menu-selected");
  });

  $(this).toggleClass("btn-menu-selected");
});


$(".logo").click(function(e){
  location.reload(true);
});
