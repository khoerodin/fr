(function (Bisnis) {
    Bisnis.Chart.Bar = {};

    Bisnis.Chart.Bar.render = function (element, data, title, xLabel, yLabel, callback) {
        return new Chart(element, {
            type: 'bar',
            data: data,
            options: {
                title:{
                    display: true,
                    text: title.toUpperCase()
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
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