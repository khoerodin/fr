(function (Bisnis) {
    Bisnis.Chart.Pie = {};

    Bisnis.Chart.Pie.render = function (element, data, title, callback) {
        return new Chart(element, {
            type: 'pie',
            data: data,
            options: {
                title:{
                    display: true,
                    text: title.toUpperCase()
                },
                responsive: true,
                onClick: callback
            }
        });
    };
})(window.Bisnis || {});