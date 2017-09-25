(function (Bisnis) {
    Bisnis.Chart.Bar = {};

    Bisnis.Chart.Bar.stacked = function (elemet, data, title, xLabel, yLabel) {
        return new Chart(elemet, {
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
                        }
                    }]
                }
            }
        });
    };
})(window.Bisnis || {});