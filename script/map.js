function addMap(){
    var cartodb = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '',
      subdomains: 'abcd',
      maxZoom: 20
    });

    window.map = L.map('map', {
        maxBounds:[[54.53974545725038, 24.998942172068308],[54.83504235452024, 25.48508717852184]],
        maxZoom:20,
        minZoom:10,
        }).setView([54.678333958732594, 25.28688040489327], 8);

    var raster_group = new L.LayerGroup([cartodb]);

    raster_group.addTo(map);

    $(".leaflet-control-container").children().removeClass("leaflet-top leaflet-left");
    $(".leaflet-control-container").children().addClass("leaflet-bottom leaflet-right");

    window.map.on('zoomend', function() {
        var currentZoom = map.getZoom();

        map.eachLayer(function(layer){
          if(layer["options"]["type"] === 'grid'){
            var size = layer.getRadius();

            if(size>(currentZoom*2)){
              size = currentZoom*2;
            }else if(size<(currentZoom/3)){
              size = currentZoom/3;
            };

            layer.setRadius(size);
          };
        });
    });

    return map
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
  $(".data-box").each(function(){$(this).fadeOut("slow")});
  $(".compare-box").fadeOut("slow");
  $(".legend").fadeOut("slow");
  $("#guide-txt").text("Select one location to explore or select more than one location to compare them:");

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
    }else if(layer["options"]["type"] === 'grid'){
      map.removeLayer(layer);
    };
  });
};


function updateIsoc(osmid, minutes){
  map.eachLayer(function(layer){
    if('osmid' in layer['options'] && layer['options']['osmid']===osmid){
      removeIsoc(osmid);
      addIsoc(osmid, minutes);
    }else if(layer["options"]["type"] === 'grid'){
      map.removeLayer(layer);
    };
  });
};


function fillIsoc(pk, time){
  var df;
  var gr;
  var dbf_val_1;
  var dbf_txt_1;
  var dbf_val_2;
  var dbf_txt_2;
  var dbf_val_3;
  var dbf_txt_3;
  var legend_txt;
  var legend_l_val;
  var legend_s_val;
  var stats;

  map.eachLayer(function(layer){
    if('type' in layer['options'] && layer['options']['type']==='data_point'){
      map.removeLayer(layer);
    };
  });

  switch (bottom_menu) {
    case 'btn-demographics':
      df = isoc_demographics;
      gr = grid_demographics;
      stats = databoard_demographics.filter(i=>i["pk"]===pk);
      stats = stats[0];
      dbf_val_1 = (stats["total_sum"]/545000*100).toFixed(2).toString()+"%";
      legend_txt = "people";
      legend_l_val = stats["total_max"];
      legend_s_val = stats["total_min"];

      $(`[data_id="${bottom_menu}"][data="dbf-val-1"]`).text(dbf_val_1);
      addPieChart(Math.round(Number(stats["male_perc"])), Math.round(Number(stats["female_perc"])));

      break;

    case 'btn-activities':
      df = isoc_pois;
      gr = grid_pois;
      db = databoard_pois;
      stats = databoard_pois.filter(i=>i["pk"]===pk);
      stats = stats[0];
      keysSorted = Object.keys(stats).sort(function(a,b){return stats[a]-stats[b]});
      dbf_val_1 = stats["total_sum"];
      dbf_txt_1 = "\n total of places";
      dbf_val_2 = stats[keysSorted[keysSorted.length-3]];
      dbf_txt_2 = `\n ${keysSorted[keysSorted.length-3]}`;
      dbf_val_3 = stats[keysSorted[keysSorted.length-4]];
      dbf_txt_3 = `\n ${keysSorted[keysSorted.length-4]}`;
      legend_txt = "places";
      legend_l_val = stats["total_max"];
      legend_s_val = stats["total_min"];

      $(`[data_id="${bottom_menu}"][data="dbf-val-1"]`).text(dbf_val_1);
      $(`[data_id="${bottom_menu}"][data="dbf-txt-1"]`).text(dbf_txt_1);
      $(`[data_id="${bottom_menu}"][data="dbf-val-2"]`).text(dbf_val_2);
      $(`[data_id="${bottom_menu}"][data="dbf-txt-2"]`).text(dbf_txt_2);
      $(`[data_id="${bottom_menu}"][data="dbf-val-3"]`).text(dbf_val_3);
      $(`[data_id="${bottom_menu}"][data="dbf-txt-3"]`).text(dbf_txt_3);

      break;
    case 'btn-realestate':
      df = isoc_realestate;
      gr = grid_realestate;
      stats = databoard_realestate.filter(i=>i["pk"]===pk);
      stats = stats[0];
      dbf_val_1 = stats["total_sum"];
      dbf_val_2 = Math.round(stats["price_sqm_avg"]);
      $(`[data_id="${bottom_menu}"][data="dbf-val-1"]`).text(dbf_val_1);
      addBarChart(dbf_val_2);

      legend_txt = "offers";
      legend_l_val = stats["total_max"];
      legend_s_val = stats["total_min"];
      break;
  };

  $("#legend-l").text(`${legend_l_val} ${legend_txt}`);
  $("#legend-s").text(`${legend_s_val} ${legend_txt}`);

  var data_fill = df.filter(i=>i["pk"]===pk);

  data_fill.forEach((item, i) => {
    var grid_id = item["id"];
    grid = gr.filter(i=>i["id"]===grid_id);
    grid = grid[0];

    var size = grid["total"]*100;
    var lat = grid["lat"];
    var lon = grid["lon"];
    var currentZoom = map.getZoom();

    if(size>(currentZoom*2)){
      size = currentZoom*2;
    }else if(size<(currentZoom/3)){
      size = currentZoom/3;
    };

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
