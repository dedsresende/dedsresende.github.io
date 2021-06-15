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
    height: 150,
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
