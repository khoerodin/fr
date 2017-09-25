(function (Bisnis) {
    Bisnis.Chart.Area = {};

    Bisnis.Chart.Area.stacked = function (elemet, data, title, xLabel, yLabel) {
        return new Chart(elemet, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                title:{
                    display: true,
                    text: title
                },
                tooltips: {
                    mode: 'index'
                },
                hover: {
                    mode: 'index'
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: xLabel
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: yLabel
                        }
                    }]
                }
            }
        });
    };
})(window.Bisnis || {});