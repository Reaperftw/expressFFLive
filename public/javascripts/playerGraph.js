var playerOptions = {
  lines: {
    show: true
  },
  points: {
    show: true
  },
  yaxis: {
    tickFormatter: function(val, axis) {
      return val < axis.max ? (val > axis.min ? val.toFixed(0) : "Picked") : "";
    },
    tickDecimals: 0,
  },
  xaxis: {
    tickFormatter: function(val, axis) {
      return val > axis.min ? val.toFixed(0) : "GW";
    },
    min: 0,
    tickDecimals: 0,
    tickSize: 1
  },
  selection: {
    mode: "xy"
  },
  grid: {
    hoverable: true
  },
  legend: {
    show: true,
    container: '#legendholderPoints'
  },
};

var playerData = null;

$(function() {

  //Tooltip definition
  $("<div id='tooltip'></div>").css({
    position: "absolute",
    display: "none",
    border: "1px solid #fdd",
    padding: "2px",
    "background-color": "#fee",
    opacity: 0.80
  }).appendTo("body");

  //Hover Tooltip
  $("#playerGraph").bind("plothover", function (event, pos, item) {
    if (item) {
      var x = item.datapoint[0].toFixed(0),
      y = item.datapoint[1].toFixed(0);

      $("#tooltip").html(item.series.label + " GW: " + x + ", #" + y)
      .css({top: item.pageY+5, left: item.pageX+5})
      .fadeIn(200);
    } else {
      $("#tooltip").hide();
    }
  });


  //Select and Zoom Feature
  $("#playerGraph").bind("plotselected", function (event, ranges) {

    // clamp the zooming to prevent eternal zoom

    if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
      ranges.xaxis.to = ranges.xaxis.from + 0.00001;
    }

    if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
      ranges.yaxis.to = ranges.yaxis.from + 0.00001;
    }

    // do the zooming

    $.plot("#playerGraph", playerData,
    $.extend(true, {}, playerOptions, {
      xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
      yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
    })
  );
});

function onArrivalPoints (result) {
  playerData = result;
  $.plot("#playerGraph", playerData, playerOptions);
}
$.getJSON("/stats/playerPicks.json", onArrivalPoints);

function reset() {
  $.plot("#playerGraph", playerData, playerOptions);
}
});

function reset() {
  $.plot("#playerGraph", playerData, playerOptions);
}
