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


function addIsoc(address, time){
  var data_sample_feats = data_sample['features'];

  data_sample_feats.forEach(function(e) {
    var search_adr = e['properties']['street_name']+' '+e['properties']['street_number'];
    var search_reg = e['properties']['region'];
    var search_lat = e['properties']['lat'];
    var search_lon = e['properties']['lon'];
    var search_time = e['properties']['time'];

    if (search_adr === address && search_time === time) {
      $('#data-board-adr').text(search_adr);
      $('#data-board-reg').text(search_reg);
      $('#data-board-latlon').text(search_lat.toFixed(5).toString()+'/'+search_lon.toFixed(5).toString());

      var coord_fill = [[180, -90], [180, 90], [-180, 90], [-180, -90]];
      var coord_pol = e['geometry']['coordinates'][0].map(x => [x[1], x[0]])
      isoc_opt['adr'] = search_adr;
      isoc_opt['adr_region'] = search_reg;
      isoc_opt['time'] = search_time;
      var isoc = L.polygon([coord_fill, coord_pol], isoc_opt);
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

      map.flyTo([search_lat, search_lon], zoom);
    };
  });
};


function removeIsoc(address){
  map.eachLayer(function(layer){
    if('adr' in layer['options'] && address === layer['options']['adr']){
      map.removeLayer(layer);
    };
  });
};


function updateIsoc(minutes){
  var data_sample_feats = data_sample['features'];

  map.eachLayer(function(layer){
    if('adr' in layer['options']){
      var act_adr = layer['options']['adr'];
      var act_min = layer['options']['time'];

      removeIsoc(act_adr);

      addIsoc(act_adr, minutes);
    };
  });
};
