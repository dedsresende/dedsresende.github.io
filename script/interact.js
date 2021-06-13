var markers_sel = new Set();
var markers_screen = new Set();
var minutes = 5;
var isoc_opt = {
  fillColor: "#ffffff",
  color: "#c3d4ca",
  weight: 3,
  opacity: 1,
  fillOpacity: 0.6
};
var fill_map = false;
var top_menu;
var bottom_menu;


function fillCompareBox(time){
  $(".table-wrapper").css("maxWidth", $('.mapBox').width()-350);
  $(".table-wrapper").css("maxHeight", $('.mapBox').height()-200);

  $("thead").empty();
  $("tbody").empty();

  var thead;
  var st;
  var adr;
  var osmid;
  var stats;
  var pk;
  var tbody = new Array();
  var data_fill = data_adr.filter(a=>markers_sel.has(a["adr_id"]));

  switch (bottom_menu) {
    case 'btn-demographics':
      st = comparison_demographics;
      break;
    case 'btn-activities':
      st = comparison_pois;
      break;
    case 'btn-realestate':
      st = comparison_realestate;
      break;
  };

  data_fill.forEach((item, i) => {
    adr = item["street_name"]+' '+item["street_number"]+', '+item["region"];
    osmid = item["osmid"];

    stats = isoc.filter(i=>i["osmid"]===osmid && i["time"]===time);
    stats = stats[0];
    pk = stats["pk"];

    stats = st.filter(i=>i["pk"]===pk);

    if(stats.length>0){
      stats = stats[0];
      delete stats["pk"];
      stats = {"selected places": adr, ...stats};
      thead = stats;
      tbody.push(stats);
    };
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

  $(".compare-box").fadeIn("slow");
};


$(".form-search").on('keypress',function(e) {
  if(e.which == 13) {
    addMarker($(this).val());

    if($(this).is("#search_landing")){
      $(".search-page").fadeOut("slow");
      $(".right-menu-top").fadeIn("slow");
      $(".left-menu-top").fadeIn("slow");
      $("#guide-txt").text("Select one or more locations");
    };
  };
});


$("#btn-explore,#btn-compare").click(function(){
  $(this).addClass("btn-menu-selected");
  var id_click = $(this).attr("id");
  top_menu = id_click;
  $("#btn-explore,#btn-compare").each(function(){
    if($(this).attr("id")!=id_click){
      $(this).removeClass("btn-menu-selected");
    };
  });
});


$("#btn-demographics,#btn-activities,#btn-realestate,#btn-humanflow,#btn-transaction,#btn-transport").click(function(){
  $(this).addClass("btn-menu-selected");
  var id_click = $(this).attr("id");
  var adr_sel = Array.from(markers_sel);
  var adr_id;
  var osmid;
  bottom_menu = id_click;

  $("#btn-demographics,#btn-activities,#btn-realestate,#btn-humanflow,#btn-transaction,#btn-transport").each(function(){
    if($(this).attr("id")!=id_click){
      $(this).removeClass("btn-menu-selected");
    };
  });

  $(".data-box").each(function(){$(this).fadeOut("slow")});

  if(top_menu==='btn-explore' && markers_sel.size===1){
    adr_id = adr_sel[0];
    adr_sel = data_adr.filter(i=>i["adr_id"]==adr_id);
    adr_sel = adr_sel[0];
    osmid = adr_sel["osmid"];

    adr_sel = adr_sel["street_name"]+' '+adr_sel["street_number"]+', '+adr_sel["region"];

    $(this).siblings().children().first().children().children().first().text(adr_sel);
    $(this).siblings().fadeIn("slow");

    $("#guide-txt").text(`Exploring ${adr_sel}`);
    $(".legend").fadeIn("slow");

    removeIsoc(osmid);
    addIsoc(osmid, minutes);
    clearMarkers(osmid);

  }else if(top_menu==='btn-explore' && markers_sel.size>1){
    $("#guide-txt").text("Select just one location to explore");
  }else if(top_menu==='btn-explore' && markers_sel.size===0){
    $("#guide-txt").text("Select one location to explore");
  }else if(top_menu==='btn-compare' && markers_sel.size>1){
    fillCompareBox(minutes);
  }else if(top_menu==='btn-compare' && markers_sel.size<2){
    $("#guide-txt").text("Select two or more locations to compare");
  };
});


$("#btn-explore").click(function(){
  clearMap();
  fillMap();

  if(markers_sel.size===1){
    $(".right-menu-bottom").fadeIn("slow");
  };
});


$("#btn-compare").click(function(){
  clearMap();
  fillMap();

  if(markers_sel.size>1){
    $(".right-menu-bottom").fadeIn("slow");
    $(".left-menu-top").fadeOut("slow");
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
  var adr;

  var adr_sel = Array.from(markers_sel);
  adr_sel.forEach((item, i) => {
    adr = item.toString();
    info.push(adr);
  });


  $(".fa-times-circle-o").each(function(){
    info.push($(this).parents().eq(0).siblings().children().text());
  });

  info = info.join(', ')


  Email.send({
    Host: "smtp.gmail.com",
    Username: "sales@datahood.co",
    Password: "9KCx%B6QKc3T",
    To: 'sales@datahood.co',
    From: "sales@datahood.co",
    Subject: "DATAHOOD data request",
    Body: info,
  })
    .then(function (message) {
      console.log("mail sent successfully");
    });

  $(".subscribe-page").fadeOut("slow");
  fillMap();
});
