var markers_sel = new Set();
var markers_screen = new Set();
var minutes = 5;
var isoc_opt = {
  fillColor: "#ffffff",
  color: "#01233c",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.6
};
var fill_map = false;


function fillCompareBox(){
  var data_fill = data_adr['features'].filter(a=>markers_sel.has(a["properties"]["adr_id"]));
  data_fill.forEach((item, i) => {
    var adr = item["properties"]["street_name"]+' '+item["properties"]["street_number"]+', '+item["properties"]["region"]

    $("tbody").append(
      `
      <tr>
        <td class="text-left">${adr}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
      `
    );
  });
};


$(".form-search").on('keypress',function(e) {
  if(e.which == 13) {
    addMarker($(this).val());

    if($(this).is("#search_landing")){
      $(".search-page").fadeOut("slow");
      $(".right-menu-top").fadeIn("slow");
      $(".left-menu-top").fadeIn("slow");
    };
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

    if($(this).is("#btn-explore") && markers_sel.size===1){
      $(".right-menu-bottom").fadeIn("slow");
    }else if($(this).is("#btn-explore") && fill_map){
      fillMap();
      fill_map = false;
    }else if($(this).is("#btn-discover")){
      $(".right-menu-bottom").fadeOut("slow");
      clearMap();
      fill_map = true;
      $(".subscribe-page").fadeIn("slow");
    }else if($(this).is("#btn-compare") && markers_sel.size>1){
      $(".right-menu-bottom").fadeIn("slow");
      $(".left-menu-top").fadeOut("slow");
      $(".compare-box").fadeIn("slow");
      clearMap();
      fill_map = true;
      fillCompareBox();
    };

  if(menu==='right-menu-bottom' && !$(this).hasClass(".btn-dist")){
    $(".data-box").each(function(){$(this).fadeOut("slow")});

    var adr_sel = Array.from(markers_sel)[0]
    adr_sel = data_adr["features"].filter(i=>i["properties"]["adr_id"]==adr_sel);
    adr_sel = adr_sel[0]["properties"];

    var osmid_sel = adr_sel['osmid'];

    clearMarkers(adr_sel["adr_id"]);
    addIsoc(osmid_sel, minutes);

    adr_sel = adr_sel["street_name"]+' '+adr_sel["street_number"]+', '+adr_sel["region"];

    $(this).siblings().children().first().children().children().first().text(adr_sel);
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

  minutes = Number($(this).attr("minutes"));

  var adr_sel = data_adr["features"].filter(i=>i["properties"]["adr_id"]==markers_sel[0]);
  adr_sel = adr_sel[0]["properties"];
  var osmid_sel = adr_sel['osmid'];

  updateIsoc(osmid_sel, minutes);
});


$(".logo").click(function(e){
  location.reload(true);
});


$(".adr-table").on("click", "i.fa-close", function(){
  var adr_id = Number($(this).parents().eq(1).attr("adr_id"));
  markers_sel.delete(adr_id);
  $(this).parents().eq(1).remove();
});


$(".right-menu-bottom").on("click", "i.fa-close", function(){
  $(".data-box").each(function(){$(this).fadeOut("slow")});
  $(".btn-menu").each(function(){$(this).removeClass("btn-menu-selected")});
});


$(".compare-box").on("click", "i.fa-close", function(){
  $(".compare-box").fadeOut("slow");
  fillMap();
});


$(".subscribe-page").on("click", "i.fa-close", function(){
  $(".subscribe-page").fadeOut("slow");
  fillMap();
});


$(".form-check").click(function(){
  $(this).toggleClass("fa-circle-o fa-circle");
});


$(".subscribe").click(function(){
  $(".right-menu-bottom").fadeOut("slow");
  clearMap();
  fill_map = true;
  $(".subscribe-page").fadeIn("slow");
});

$("#submit").click(function(){
  var email=$("#email").val();
  var info = new Array();

  $(".fa-circle").each(function(){
    info.push($(this).parents().eq(0).siblings().children().text());
  });

  info = info.join(', ')

  Email.send({
    SecureToken : "eb6de852-4848-4ddb-adbe-f31585ce46ac",
    To : email,
    From : "dedsresende@gmail.com",
    Subject : "DATAHOOD test!",
    Body : info
  }).then(
    message => alert("Thanks for contacting DATAHOOD!")
  );

  $(".subscribe-page").fadeOut("slow");
  fillMap();
});
