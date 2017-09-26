(function (Bisnis) {
    Bisnis.Chart.Line = {};

    Bisnis.Chart.Line.render = function (element, data, title, xLabel, yLabel, callback) {
        return new Chart(element, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                title:{
                    display:true,
                    text: title
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: xLabel
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: yLabel
                        },
                        ticks: {
                            min: 0,
                            stepSize: 10
                        }
                    }]
                },
                onClick: callback
            }
        });
    };
})(window.Bisnis || {});