var data_sources = {
  "Demographics": `
  Census data indicates the amount of people and gender distribution.
  <br>
  Full access gives you average age, level of education, type of income and languages spoken.
  `,
  "Activities": `
  Activities data identifies businesses, competitors and public services within the selected area.
  <br>
  Full access will give you  detailed image of different competitors or attractors,
  their types and locations in the area.
  `,
  "Real estate": `
  Real estate data gives you a clear image of sales prices,
  change in time and vacancy for commercial type of listings.
  <br>
  Full access give you a detailed locations and information for the selected area.
  `,
  "Human flow": `
  Human flow data shows potential customers to identify the most busy locations
  within selected area at different times and locations they come from (place of origin).
  `,
  "Transaction": `
  Transaction data allows you to see the average spending within the selected area in time.
  `,
  "Transport": `
  Transport data allows you to see the intensity of traffic within the selected area in time.
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
      data_box_fill = `
      <div class="row"><div class="col-12 data-box-text">${txt}</div></div>
      <br>
      <div class="row">
        <div class="col-3 data-box-val">
          <h4 class="hdb" data_id="btn-demographics" data="dbf-val-1">XXX</h4>
        </div>
        <div class="col-6 data-box-txt">
          <p class="font-weight-bold text-left" data_id="btn-demographics" data="dbf-txt-1">of Vilnius population lives in this area.</p>
        </div>
      </div>
      <br>
      <div class="row"><div class="col-12" id="pie-chart"></div></div>
      `;
      break;

    case 'btn-activities':
      data_box_fill = `
      <div class="row"><div class="col-12 data-box-text">${txt}</div></div>
      <br>
      <div class="row data-row">
        <div class="data-box-val">
          <h4 class="hdb" data_id="btn-activities" data="dbf-val-1">XXX</h4>
        </div>
        <div class="data-box-txt">
          <p class="font-weight-bold text-left" data_id="btn-activities" data="dbf-txt-1">activities</p>
        </div>
      </div>
      <br>
      <div class="row data-row">
        <div class="data-box-val">
          <h4 class="hdb" data_id="btn-activities" data="dbf-val-2">XXX</h4>
        </div>
        <div class="data-box-txt">
          <p class="font-weight-bold text-left" data_id="btn-activities" data="dbf-txt-2">activities</p>
        </div>
      </div>
      <br>
      <div class="row data-row">
        <div class="data-box-val">
          <h4 class="hdb" data_id="btn-activities" data="dbf-val-3">XXX</h4>
        </div>
        <div class="data-box-txt">
          <p class="font-weight-bold text-left" data_id="btn-activities" data="dbf-txt-3">activities</p>
        </div>
      </div>
      <br>

      `;
      break;

    case 'btn-realestate':
      data_box_fill = `
      <div class="row"><div class="col-12 data-box-text">${txt}</div></div>
      <br>
      <div class="row"><div class="col-12" id="bar-chart"></div></div>
      <br>
      <div class="row">
        <div class="data-box-val">
          <h4 class="hdb" data_id="btn-realestate" data="dbf-val-1">XXX</h4>
        </div>
        <div class="data-box-txt">
          <p class="font-weight-bold text-left" data_id="btn-realestate" data="dbf-txt-1">total available<br>sales listings<br>in the area.</p>
        </div>
      </div>
      `;
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
