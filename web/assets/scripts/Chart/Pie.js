(function (Bisnis) {
    Bisnis.Chart.Pie = {};

    Bisnis.Chart.Pie.render = function (elemet, data, title) {
        return new Chart(elemet, {
            type: 'pie',
            data: data,
            options: {
                title:{
                    display:true,
                    text: title
                },
                responsive: true
            }
        });
    };
})(window.Bisnis || {});