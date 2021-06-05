function addMap(){
    var cartodb = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: 'DATAHOOD',
      subdomains: 'abcd',
      maxZoom: 20
    });

    window.map = L.map('map', {
        maxBounds:[[54.53974545725038, 24.998942172068308],[54.83504235452024, 25.48508717852184]],
        // zoomControl:false,
        maxZoom:20,
        minZoom:10,
        }).setView([54.678333958732594, 25.28688040489327], 8);

    var raster_group = new L.LayerGroup([cartodb]);

    raster_group.addTo(map);

    $(".leaflet-control-container").children().removeClass("leaflet-top leaflet-left");
    $(".leaflet-control-container").children().addClass("leaflet-bottom leaflet-right");
};


function markerOnClick(marker){
  var osmid = marker["target"]["options"]["osmid"];
  var adr_id = marker["target"]["options"]["adr_id"];
  var adr_lbl = marker["target"]["options"]['street_name']+' '+marker["target"]["options"]['street_number'];

  $(`i[osmid=${osmid}]`).toggleClass("map-marker-selected");

  var adr_sel = Array.from(markers_sel);

  if($(`[osmid=${osmid}]`).hasClass("map-marker-selected")){
    if(!adr_sel.includes(adr_id)){
      markers_sel.add(adr_id);

      $(".adr-table").append(
        `
        <div class="row" adr_id=${adr_id} osmid=${osmid}>
          <div class="col-11 text-left">
            <p class="font-weight-bold">${adr_lbl}</p>
          </div>
          <a class="col-1">
            <i class="fa fa-close"></i>
          </a>
        </div>
        `
      );
    }
  }else{
    $(".adr-table").children(`[osmid=${osmid}]`).remove();
    markers_sel.delete(adr_id);
  };

  if(markers_sel.size>0){
    $(".adr_box").fadeIn("slow");
  }else{
    $(".adr_box").fadeOut("slow");
  };
};


function addMarker(address){
  var marker_group = new Array();
  var adr = address.toLowerCase();

  data_adr.forEach(function(e) {
    var search_txt = e['search_txt'];
    var adr_id = e['adr_id'];
    var osmid = e['osmid'];

    if(search_txt){
      search_txt = search_txt.toLowerCase();

      if(search_txt.includes(adr)){
        var marker_icon = L.divIcon({
          html: `<i class="fa fa-map-marker fa-4x" adr_id=${adr_id} osmid=${osmid}></i>`,
          iconSize: new L.Point(20, 20),
          className: 'map-marker'
        });

      e["type"] = 'marker';
      e["icon"] = marker_icon;

      var marker = L.marker([e["lat"], e["lon"]], e).on('click', markerOnClick);

      marker.addTo(map);
      markers_screen.add(adr_id);
      marker_group.push(marker);
      };
    };
  });

  marker_group = new L.featureGroup(marker_group);
  map.flyTo([marker_group.getBounds().getCenter()["lat"], marker_group.getBounds().getCenter()["lng"]], 12);
  marker_group = null;
};


function removeMarker(adr_id){
  markers_screen.delete(adr_id);
  markers_sel.delete(adr_id);

  map.eachLayer(function(layer){
    if(layer['options']["type"] === 'marker' && adr_id === layer['options']['adr_id']){
      map.removeLayer(layer);
    };
  });
};


function clearMap(){
  // $(".data-box").each(e=>$(this).fadeOut("slow"));
  $(".data-box").each(function(){$(this).fadeOut("slow")});
  $(".compare-box").fadeOut("slow");

  map.eachLayer(function(layer){
    if(layer["options"]["type"] === 'marker' || layer["options"]["type"] === 'isochrone' || layer["options"]["type"] === 'grid'){
      map.removeLayer(layer);
    };
  });
};


function clearMarkers(osmid){
  map.eachLayer(function(layer){
    if(layer['options']["type"] === 'marker' && osmid !== layer['options']['osmid']){
      map.removeLayer(layer);
    };
  });
};


function fillMap(){
  var marker_group = new Array();
  var data_fill = data_adr.filter(a=>markers_screen.has(a["adr_id"]));
  var adr_sel = Array.from(markers_sel);

  data_fill.forEach(function(e) {
    var search_txt = e['search_txt'];
    var adr_id = e['adr_id'];
    var osmid = e['osmid'];

    if(adr_sel.includes(adr_id)){
      var marker_icon = L.divIcon({
        html: `<i class="fa fa-map-marker fa-4x map-marker-selected" adr_id="${adr_id}" osmid=${osmid}></i>`,
        iconSize: new L.Point(20, 20),
        className: 'map-marker'
      });
    }else{
      var marker_icon = L.divIcon({
        html: `<i class="fa fa-map-marker fa-4x" adr_id="${adr_id}" osmid=${osmid}></i>`,
        iconSize: new L.Point(20, 20),
        className: 'map-marker'
      });
    };

    e["type"] = 'marker';
    e["icon"] = marker_icon;

    var marker = L.marker([e["lat"], e["lon"]], e).on('click', markerOnClick);

    marker.addTo(map);
    marker_group.push(marker);
  });

  marker_group = new L.featureGroup(marker_group);
  map.flyTo([marker_group.getBounds().getCenter()["lat"], marker_group.getBounds().getCenter()["lng"]], 12);
  marker_group = null;
};


function addIsoc(osmid, time){
  var isoc_sel = isoc.filter(i=>i["osmid"]===osmid && i["time"]===time);
  isoc_sel = isoc_sel[0];

  var coord_fill = [[180, -90], [180, 90], [-180, 90], [-180, -90]];
  var coord_pol = isoc_sel['coord'].map(x => [x[1], x[0]]);
  var pk = isoc_sel["pk"]

  isoc_opt["pk"] = pk;
  isoc_opt["osmid"] = osmid;
  isoc_opt["time"] = time;
  isoc_opt["type"] = 'isochrone';

  isoc_sel = L.polygon([coord_fill, coord_pol], isoc_opt);
  isoc_sel.addTo(map);

  var bounds = L.polygon(coord_pol);
  bounds = bounds.getBounds();

  map.fitBounds(bounds);

  fillIsoc(pk, time);
};


function removeIsoc(osmid){
  map.eachLayer(function(layer){
    if('osmid' in layer['options'] && layer['options']['type']==='isochrone' && osmid === layer['options']['osmid']){
      map.removeLayer(layer);
    };
  });
};


function updateIsoc(osmid, minutes){
  map.eachLayer(function(layer){
    if('osmid' in layer['options'] && layer['options']['osmid']===osmid){
      removeIsoc(osmid);
      addIsoc(osmid, minutes);
    };
  });
};


function fillIsoc(pk, time){
  var df;
  var gr;

  map.eachLayer(function(layer){
    if('type' in layer['options'] && layer['options']['type']==='data_point'){
      map.removeLayer(layer);
    };
  });

  switch (bottom_menu) {
    case 'btn-demographics':
      df = isoc_demographics;
      gr = grid_demographics;
      break;
    case 'btn-activities':
      df = isoc_pois;
      gr = grid_pois;
      break;
    case 'btn-realestate':
      df = isoc_realestate;
      gr = grid_realestate;
      break;
  };

  var data_fill = df.filter(i=>i["pk"]===pk);

  data_fill.forEach((item, i) => {
    var grid_id = item["id"];
    grid = gr.filter(i=>i["id"]===grid_id);
    grid = grid[0];

    var size = grid["total"]*100;
    var lat = grid["lat"];
    var lon = grid["lon"];

    var markerOptions = {
      radius: size,
      fillColor: "#000000",
      weight: 0.0,
      opacity: 0.0,
      fillOpacity: 1.0,
      type: "grid",
      time: time
    };

    L.circleMarker([lat, lon], markerOptions).addTo(map);
  });
};
