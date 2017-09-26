(function (Bisnis) {
    Bisnis.Chart.Bar = {};

    Bisnis.Chart.Bar.renderStack = function (element, data, title, xLabel, yLabel, callback) {
        return new Chart(element, {
            type: 'bar',
            data: data,
            options: {
                title:{
                    display:true,
                    text: title
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

    Bisnis.Chart.Bar.renderMultibar = function (element, data, title, xLabel, yLabel) {
        return new Chart(element, {
            type: 'bar',
            data: data,
            options: {
                title:{
                    display:true,
                    text: title
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: xLabel
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: yLabel
                        },
                        ticks: {
                            min: 0,
                            stepSize: 10
                        }
                    }]
                }
            }
        });
    };
})(window.Bisnis || {});