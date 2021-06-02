var markers_sel = new Set();
var markers_screen = new Set();
var minutes = 5;
var isoc_opt = {
  fillColor: "#ffffff",
  color: "#c3d4ca",
  weight: 3,
  opacity: 1,
  fillOpacity: 0.2
};
var fill_map = false;
var data;


function fillCompareBox(time){
  var thead;
  var tbody = new Array();
  var data_fill = data_adr.filter(a=>markers_sel.has(a["adr_id"]));
  data_fill.forEach((item, i) => {
    var adr = item["street_name"]+' '+item["street_number"]+', '+item["region"];
    var osmid = item["osmid"];

    var stats = isoc.filter(i=>i["osmid"]===osmid && i["time"]===time);
    stats = stats[0];
    var pk = stats["pk"];

    stats = databoard_demographics.filter(i=>i["pk"]===pk);
    stats = stats[0];
    delete stats["pk"];
    stats = {"selected places": adr, ...stats};
    thead = stats;
    tbody.push(stats);
  });

  thead = Object.keys(thead);
  thead = thead.map(e=>`<th>${e}</th>`);
  thead = thead.join('');
  $("thead").append(
    `
    <tr>
    ${thead}
    </tr>
    `
  );
  tbody = tbody.map(e=>Object.values(e));
  tbody.forEach((row, idx) => {
    row_txt = new Array();

    row.forEach((item, i) => {
      if(i===0){
        var t = `<th>${item}</th>`
      }else{
        var t = `<td class="table-data">${item}</td>`
      }
      row_txt.push(t);
    });

    row_txt = row_txt.join('');

    $("tbody").append(
      `
      <tr>
      ${row_txt}
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


$("#btn-explore,#btn-compare,#btn-discover").click(function(){
  $(this).addClass("btn-menu-selected");
  var id_click = $(this).attr("id");
  $("#btn-explore,#btn-compare,#btn-discover").each(function(){
    if($(this).attr("id")!=id_click){
      $(this).removeClass("btn-menu-selected");
    };
  });
});


$("#btn-demographics,#btn-activities,#btn-realestate,#btn-humanflow,#btn-transaction,#btn-transport").click(function(){
  $(this).addClass("btn-menu-selected");
  var id_click = $(this).attr("id");
  $("#btn-demographics,#btn-activities,#btn-realestate,#btn-humanflow,#btn-transaction,#btn-transport").each(function(){
    if($(this).attr("id")!=id_click){
      $(this).removeClass("btn-menu-selected");
    };
  });

  data = $(this).attr("id").replace('btn-', '').toLowerCase();

  $(".data-box").each(function(){$(this).fadeOut("slow")});

  var adr_id = Array.from(markers_sel)[0];
  adr_sel = data_adr.filter(i=>i["adr_id"]==adr_id);
  adr_sel = adr_sel[0];
  var osmid = adr_sel["osmid"];

  adr_sel = adr_sel["street_name"]+' '+adr_sel["street_number"]+', '+adr_sel["region"];

  $(this).siblings().children().first().children().children().first().text(adr_sel);
  $(this).siblings().fadeIn("slow");

  removeIsoc(osmid);
  addIsoc(osmid, minutes);
  clearMarkers(osmid);
});


$("#btn-explore").click(function(){
  if(markers_sel.size===1){
    $(".right-menu-bottom").fadeIn("slow");
  };
});


$("#btn-discover").click(function(){
  $(".right-menu-bottom").fadeOut("slow");
  clearMap();
  fill_map = true;
  $(".subscribe-page").fadeIn("slow");
});


$("#btn-compare").click(function(){
  if(markers_sel.size>1){
    $(".right-menu-bottom").fadeIn("slow");
    $(".left-menu-top").fadeOut("slow");
    $(".compare-box").fadeIn("slow");
    clearMap();
    fill_map = true;
    fillCompareBox(minutes);
  };
});


$(".btn-dist").click(function(){
  $(".btn-dist").each(function(){
    $(this).removeClass("btn-menu-selected");
  });

  $(this).toggleClass("btn-menu-selected");

  minutes = Number($(this).attr("minutes"));
  var adr_sel = Array.from(markers_sel)[0]
  adr_sel = data_adr.filter(i=>i["adr_id"]==adr_sel);
  adr_sel = adr_sel[0];
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

  $(".fa-map-marker").each(function(){
    if(adr_id===Number($(this).attr("adr_id"))){$(this).removeClass("map-marker-selected")};
  });

  if(markers_sel.size>0){
    $(".adr_box").fadeIn("slow");
  }else{
    $(".adr_box").fadeOut("slow");
  };
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
  $(this).toggleClass("fa-circle-o fa-times-circle-o");
});


$(".btn-request").click(function(){
  $(".right-menu-bottom").fadeOut("slow");
  clearMap();
  fill_map = true;
  $(".subscribe-page").fadeIn("slow");
});

$("#submit").click(function(){
  var email=$("#email").val();
  var info = [email];

  $(".fa-circle").each(function(){
    info.push($(this).parents().eq(0).siblings().children().text());
  });

  info = info.join(', ')

  Email.send({
    Host : "smtp.elasticemail.com",
    SecureToken : "ab8a208a-bfa3-4f0b-aa98-8c7be8669fb9",
    To : "dedsresende@gmail.com",
    From : "dedsresende@gmail.com",
    Subject : "DATAHOOD data request",
    Body : info
  }).then(
    message => alert("Thanks for contacting DATAHOOD!")
  );

  $(".subscribe-page").fadeOut("slow");
  fillMap();
});
