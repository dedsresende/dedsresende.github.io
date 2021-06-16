function addPieChart(male, female){
  var data = [{
    values: [male, female],
    labels: ['male', 'female'],
    hoverinfo: 'label+percent',
    hole: .5,
    type: 'pie',
    textposition: "outside",
    textinfo: "label+percent",
    automargin: true,
    marker: {
        colors: ["#01233c", "#c3d4ca"]
      },
    textfont: {
        family: 'Ubuntu',
        size: 14,
        color: '#00000'
    }
  }];

  var layout = {
    height: 100,
    width: 280,
    showlegend: false,
    // autosize: false,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
  };

  Plotly.newPlot('pie-chart', data, layout);
};


function addBarChart(val){
  var trace = {
    x: [4600],
    y: [1],
    orientation: 'h',
    marker: {
      color: "#c3d4ca",
      width: 0.3
    },
    type: 'bar'
  };

  var data = [trace];

  var layout = {
    barmode: 'overlay',
    height: 100,
    width: 280,
    showlegend: false,
    title: {
      text:'Average price/sqm',
      font: {
        family: 'Ubuntu',
        size: 18,
        color: "#01233c"
      },
      xref: 'paper',
      x: 0
    },
    xaxis: {
      range: [350, 4600],
      showgrid: false,
      zeroline: false,
      showline: false,
      showticklabels: false
    },
    yaxis: {
      range: [0, 2],
      showgrid: false,
      zeroline: false,
      showline: false,
      showticklabels: false
    },
    margin: {
      l: 0,
      r: 0,
      b: 25,
      t: 25,
      pad: 0
    },
    shapes: [
      {
        type: 'line',
        x0: val,
        y0: 0.5,
        x1: val,
        y1: 1.5,
        line: {
          color: "#01233c",
          width: 5
        }
      }
    ],
    annotations: [
      {
        xref: 'x',
        yref: 'y',
        x: 350,
        xanchor: 'left',
        y: 0.5,
        yanchor: 'top',
        text: '350',
        showarrow: false,
        font: {
          family: 'Ubuntu',
          size: 15,
          color: "#c3d4ca"
        },
      },
      {
        xref: 'x',
        yref: 'y',
        x: 4600,
        xanchor: 'right',
        y: 0.5,
        yanchor: 'top',
        text: '4600',
        showarrow: false,
        font: {
          family: 'Ubuntu',
          size: 15,
          color: "#c3d4ca"
        },
      },
      {
        xref: 'x',
        yref: 'y',
        x: val,
        xanchor: 'center',
        y: 0.2,
        yanchor: 'top',
        text: val.toString()+' Eur',
        showarrow: false,
        font: {
          family: 'Ubuntu',
          size: 20,
          color: "#01233c"
        },
      }
    ]
  };

  Plotly.newPlot('bar-chart', data, layout);
};
