var data_sources = {
  "Demographics": `
  Census data indicates amounts of people, age, level of education,
  type of income, and languages spoken.
  `,
  "Activities": `
  Activities data identifies business and public services within the selected area.
  Full access will give you detailed image of what kind of competitors
  or attractors are located in the selected area.
  `,
  "Real estate": `
  Real estate data gives you a clear image of rental prices,
  change in time and vacancy for commercial type of listings.
  `,
  "Human flow": `
  Human mobility data shows human flow in near real time to identify human
  activities within the selected area, identify modes of transport,
  most active times, and many more aspects.
  <br><br>
  This dataset will give you essential insights to make decisions less risky.
  `,
  "Transaction": `
  Transaction data shows the expenditure and types of spendings in physical
  locations within the selected area.
  <br><br>
  This dataset will help you determine possible revenues for your new locations,
  or identify loss revenue streams in existing locations.
  `,
  "Transport": `
  Transport data combines real-time traffic from public, private and shared
  modes of transport.
  `
};
var data_box = [];

var dist_div = `
<div class="row">
  <p>data layers:</p>
</div>
`
$(".right-menu-bottom").append(dist_div);

Object.keys(data_sources).forEach((item, i) => {
  var id = 'btn-'+item.replace(' ', '').toLowerCase();
  var txt = data_sources[item];
  var data_box_fill;

  if(i>2){
    item = `${item}<a><i class="fa fa-lock float-right"></i></a>`
  };

  var dbf1 = `
  <div class="row"><div class="col-12 data-box-text">${txt}</div></div>
  <br>
  <div class="row"><div class="col-12 data-box-text"><h4 class="hdb" data_id="${id}" data="dbf-val-1">XXX</h4><h6 data_id="${id}" data="dbf-txt-1">blablablabla</h6></div></div>
  <div class="row"><div class="col-12 data-box-text"><h4 class="hdb" data_id="${id}" data="dbf-val-2">XXX</h4><h6 data_id="${id}" data="dbf-txt-2">blablablabla</h6></div></div>
  <div class="row"><div class="col-12 data-box-text"><h4 class="hdb" data_id="${id}" data="dbf-val-3">XXX</h4><h6 data_id="${id}" data="dbf-txt-3">blablablabla</h6></div></div>
  `

  var dbf2 = `<div class="row"><div class="col-12 data-box-text">${txt}</div></div>`

  switch (id) {
    case 'btn-demographics':
      data_box_fill = dbf1;
      break;
    case 'btn-activities':
      data_box_fill = dbf1;
      break;
    case 'btn-realestate':
      data_box_fill = dbf1;
      break;
    case 'btn-humanflow':
      data_box_fill = dbf2
      break;
    case 'btn-realestate':
      data_box_fill = dbf2
      break;
    case 'btn-realestate':
      data_box_fill = dbf2
      break;
  };

  var div = `<div class="row">
    <button type="button" class="btn btn-menu font-weight-bold" id="${id}">${item}</button>
    <div class="data-box">
      <div class="row text-left">
        <div class="col-11 text-left">
          <h5 class="font-weight-bold">${item}</h5>
        </div>
        <div class="col-1 text-right">
          <i class="fa fa-close"></i>
        </div>
      </div>
      <br>
      ${data_box_fill}
      <br>
      <div class="row">
        <div class="col-12"><button type="button" class="btn btn-request font-weight-bold">Request report!</button></div>
      </div>
    </div>
  </div>`

  $(".right-menu-bottom").append(div);
});

var dist_div = `
<div class="row">
  <p>catchment area / min</p>
</div>

<div class="row">
  <div class="col-4">
    <button type="button" class="btn btn-dist btn-menu-selected font-weight-bold" id="btn-5" minutes=5>5</button>
  </div>
  <div class="col-4">
    <button type="button" class="btn btn-dist font-weight-bold" id="btn-10" minutes=10>10</button>
  </div>
  <div class="col-4">
    <button type="button" class="btn btn-dist font-weight-bold" id="btn-15" minutes=15>15</button>
  </div>
</div>
`
$(".right-menu-bottom").append(dist_div);
