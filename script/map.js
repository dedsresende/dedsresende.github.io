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
  var id = marker["target"]["options"]["adr_id"];
  $(`[adr_id=${id}]`).toggleClass("map-marker-selected");

  if($(`[adr_id=${id}]`).hasClass("map-marker-selected")){
    markers_sel.add(id);
  }else{
    markers_sel.delete(id);
  };
};


function addMarker(address){
  var marker_group = new Array();
  var adr = address.toLowerCase();

  data_adr['features'].forEach(function(e) {
    var search_txt = e['properties']['search_txt'];
    var adr_id = e['properties']['adr_id'];

  if(search_txt){
    search_txt = search_txt.toLowerCase();

    if(search_txt.includes(adr)){
      var adr_lbl=e['properties']['street_name']+' '+e['properties']['street_number'];

      $(".adr-table").append(
        `
        <div class="row" adr_id=${adr_id}>
          <div class="col-11 text-left">
            <p class="font-weight-bold">${adr_lbl}</p>
          </div>
          <a class="col-1">
            <i class="fa fa-close"></i>
          </a>
        </div>
        `
      );


      var marker_icon = L.divIcon({
        html: `<i class="fa fa-map-marker fa-4x" adr_id="${adr_id}"></i>`,
        iconSize: new L.Point(20, 20),
        className: 'map-marker'
      });

      e['properties']['pointToLayer'] = function (feature, latlng) {return L.marker(latlng, {icon: marker_icon})};
      e['properties']["type"] = 'marker';

      var marker = L.geoJSON(e, e['properties']).on('click', markerOnClick);

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
  map.eachLayer(function(layer){
    if(layer["options"]["type"] === 'marker' || layer["options"]["type"] === 'isochrone'){
      map.removeLayer(layer);
    };
  });
};


function clearMarkers(adr_id){
  map.eachLayer(function(layer){
    if(layer['options']["type"] === 'marker' && adr_id !== layer['options']['adr_id']){
      map.removeLayer(layer);
    };
  });
};


function fillMap(){
  var marker_group = new Array();
  var data_fill = data_adr['features'].filter(a=>markers_screen.has(a["properties"]["adr_id"]));

  data_fill.forEach(function(e) {
    var search_txt = e['properties']['search_txt'];
    var adr_id = e['properties']['adr_id'];

    var marker_icon = L.divIcon({
      html: `<i class="fa fa-map-marker fa-4x" adr_id="${adr_id}"></i>`,
      iconSize: new L.Point(20, 20),
      className: 'map-marker'
    });

    e['properties']['pointToLayer'] = function (feature, latlng) {return L.marker(latlng, {icon: marker_icon})};
    e['properties']["type"] = 'marker';

    var marker = L.geoJSON(e, e['properties']).on('click', markerOnClick);
    marker_group.push(marker);

    marker.addTo(map);
  });

marker_group = new L.featureGroup(marker_group);
map.flyTo([marker_group.getBounds().getCenter()["lat"], marker_group.getBounds().getCenter()["lng"]], 12);
marker_group = null;
};


function addIsoc(osmid, time){
  var isoc = data_isoc["features"].filter(i=>i["properties"]["osmid"]===osmid && i["properties"]["time"]===time);
  var coord_fill = [[180, -90], [180, 90], [-180, 90], [-180, -90]];
  var coord_pol = isoc[0]['geometry']['coordinates'][0].map(x => [x[1], x[0]]);

  isoc_opt["osmid"] = osmid;
  isoc_opt["time"] = time;
  isoc_opt["type"] = 'isochrone';

  var center = data_adr["features"].filter(i=>i["properties"]["osmid"]===osmid);
  center = center[0]['geometry']['coordinates'];
  var center_lat = center[1];
  var center_lng = center[0];

  isoc = L.polygon([coord_fill, coord_pol], isoc_opt);
  isoc.addTo(map);

  switch(time){
    case 5:
      zoom = 16;
      break;
    case 10:
      zoom = 15;
      break;
    case 15:
    zoom = 14;
  };

  map.flyTo([center_lat, center_lng], zoom);
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
