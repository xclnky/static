$(document).ready(function () {
  charts = {};
  chartsTimer = {};

  startChartColorUpdateTimer = function (chart_id) {
    chartTimer = chartsTimer[chart_id];
    if (!chartTimer) {
      chartsTimer[chart_id] = setInterval(function () {
        updateChartColor(chart_id);
      }, 500);
    }
  };

  updateChartColor = function (chart_id) {
    var minValue = parseFloat(
      $(`#${chart_id}-slider-range`).slider("option", "min")
    );
    var maxValue = parseFloat(
      $(`#${chart_id}-slider-range`).slider("option", "max")
    );

    var low = parseFloat($(`#${chart_id}-slider-range`).slider("values")[0]);
    var high = parseFloat($(`#${chart_id}-slider-range`).slider("values")[1]);

    var scaledLowValue = Math.round(
      (99 * (low - minValue)) / (maxValue - minValue)
    );
    var scaledHighValue = Math.round(
      (99 * (high - minValue)) / (maxValue - minValue)
    );

    //console.log(scaledLowValue, scaledHighValue)

    if (charts[chart_id]) {
      charts[chart_id].data.colors({
        data1: function (d) {
          return d.index >= scaledLowValue && d.index <= scaledHighValue
            ? "#467fcf"
            : "#ececec";
        },
      });
    }
  };

  stopChartColorUpdateTimer = function (chart_id) {
    chartTimer = chartsTimer[chart_id];
    if (chartTimer) {
      chartsTimer[chart_id] = clearInterval(chartTimer);
      updateChartColor(chart_id);
    }
  };

  generateChart = function (chart_id, chart_div_id, data, color) {
    data.histogram.unshift("data1");

    var chart = c3.generate({
      bindto: chart_div_id, // id of chart wrapper
      data: {
        columns: [
          // each columns data
          data.histogram,
        ],
        type: "bar", // default type of chart
        colors: {
          data1: "#467fcf",
        },
      },
      axis: {
        x: {
          type: "category",
          // name of each category
          categories: data.edges,
          show: false,
        },
        y: {
          show: false,
          max: data.histogram_max,
          padding: { top: 0, bottom: 0 },
        },
      },
      legend: {
        show: false, //hide legend
      },
      tooltip: {
        show: false,
        point: false,
      },
      padding: {
        bottom: 0,
        top: 0,
      },
    });
    charts[chart_id] = chart;
  };
});

$(document).ready(function () {
  // Add brand popover
  var popOverRequest = {};
  var popOverFlag = {};
  $(document).on("mouseenter mouseleave", ".brand-profile-overlay", function (
    event
  ) {
    if (event.type === "mouseenter") {
      var e = $(this);
      var brand_uuid = e[0].getAttribute("data-brand-uuid");
      var popover_url = `/brands/${brand_uuid}/sections_ajax?feed_name=brand_profile`;

      if (!brand_uuid in popOverFlag || !popOverFlag[brand_uuid]) {
        popOverFlag[brand_uuid] = true;
        popOverRequest[brand_uuid] = $.get(popover_url, function (d) {
          e.popover({
            html: true,
            trigger: "hover",
            content: d,
            container: e,
          }).popover("show");
        });
      }
    } else {
      var e = $(this);
      var brand_uuid = e[0].getAttribute("data-brand-uuid");
      if (brand_uuid in popOverRequest) {
        popOverRequest[brand_uuid].abort();
      }
      e.popover("hide");
      popOverFlag[brand_uuid] = false;
    }
  });
});

(function ($) {
  $.fn.showLoader = function () {
    $(this).html(
      `
      <div class="d-flex justify-content-center">
        <div class="loader"></div>
      </div>
      `
    );
    return this;
  };

  $.fn.showErrorOnFailedAjaxRequest = function (reloadAjaxObj = null) {
    /*var errorText = `
    <div class="d-flex justify-content-center">
      Error when fetching the data
    </div>
    `;
    */
    var errorText = "";
    var reloadDiv = "";

    /*
    if (reloadAjaxObj) {
      reloadDiv = `
      <div class="d-flex justify-content-center">
        <div class="btn btn-primary btn-sm reloadDataBtn">
          Reload the data
        </div>
      </div>
      `;
    }
    */

    $(this).html(errorText + reloadDiv);

    /*
    if (reloadAjaxObj) {
      $(this)
        .find(".reloadDataBtn")
        .on("click", function () {
          $.ajax(reloadAjaxObj);
        });
    }
    */
  };
})(window.jQuery);

