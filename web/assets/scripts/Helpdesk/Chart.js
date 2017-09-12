(function (Bisnis) {

    //STATUS OPEN
    function statusOpen(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [
                    {
                        'status' : 'open'
                    }
                ]
            },
            success: function (data, textStatus, jqXHR) {

                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)

            }
        });

    }

    function open() {
        statusOpen(function(d) {
            return d;
        });
    }

    //STATUS ASSIGNMENT
    function statusAssignment(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [
                    {
                        'status' : 'assignment'
                    }
                ]
            },
            success: function (data, textStatus, jqXHR) {

                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)

            }
        });

    }

    function assignment() {
        statusAssignment(function(d) {
            return d;
        });
    }

    //STATUS ON PROGRESS
    function statusOnProgress(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [
                    {
                        'status' : 'onprogress'
                    }
                ]
            },
            success: function (data, textStatus, jqXHR) {

                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)

            }
        });

    }

    function onprogress() {
        statusOnProgress(function(d) {
            return d;
        });
    }

    //STATUS RESOLVED
    function statusResolved(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [
                    {
                        'status' : 'resolved'
                    }
                ]
            },
            success: function (data, textStatus, jqXHR) {

                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)

            }
        });

    }

    function resolved() {
        statusResolved(function(d) {
            return d;
        });
    }

    //STATUS CLOSED
    function statusClosed(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [
                    {
                        'status' : 'closed'
                    }
                ]
            },
            success: function (data, textStatus, jqXHR) {

                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)

            }
        });

    }

    function closed() {
        statusClosed(function(d) {
            return d;
        });
    }

    var arrayStatus = [
        open,
        assignment,
        onprogress,
        resolved,
        closed
    ];
    
// ----------------------------- STATUS TICKET (LINE CHART) ---------------------------


var dataStatus = {
    labels : ["Open","Assignment","On Progress","Resolved","Closed"],
    datasets : [
        {
            fillColor : "rgba(172,194,132,0.4)",
            strokeColor : "#ACC26D",
            pointColor : "#fff",
            pointStrokeColor : "#9DB86D",
            // data : [203,156,99,251,305,247]
            data : [
                arrayStatus[0](), //open(),
                arrayStatus[1](), //assignment(),
                arrayStatus[2](), //onprogress(),
                arrayStatus[3](), //resolved(),
                arrayStatus[4]() //closed()
                // 43,10,1,4,6
            ]
        }
    ]
};
// get line chart canvas
var statusTicket = document.getElementById('statusTicket').getContext('2d');
// draw line chart
new Chart(statusTicket).Line(dataStatus);
// ----------------------------- END STATUS TICKET (LINE CHART) ---------------------------

// ----------------------------- STATISTIK TIKET BERDASARKAN CLIENT (PIE CHART) ---------------------------
var pieData = [
    {
        value: 20,
        color:"#878BB6"
    },
    {
        value : 40,
        color : "#4ACAB4"
    },
    {
        value : 10,
        color : "#FF8153"
    },
    {
        value : 30,
        color : "#FFEA88"
    }
];
// pie chart options
var pieOptions = {
    segmentShowStroke : false,
    animateScale : true
}
// get pie chart canvas
var countries= document.getElementById("countries").getContext("2d");
// draw pie chart
new Chart(countries).Pie(pieData, pieOptions);
// ----------------------------- END STATISTIK TIKET BERDASARKAN CLIENT (PIE CHART) ---------------------------


// ----------------------------- STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (BAR CHART) ---------------------------
var barData = {
    labels : ["January","February","March","April","May","June"],
    datasets : [
        {
            fillColor : "#48A497",
            strokeColor : "#48A4D1",
            data : [456,479,324,569,702,600]
        },
        {
            fillColor : "rgba(73,188,170,0.4)",
            strokeColor : "rgba(72,174,209,0.4)",
            data : [364,504,605,400,345,320]
        }
    ]
}
// get bar chart canvas
var income = document.getElementById("income").getContext("2d");
// draw bar chart
new Chart(income).Bar(barData);
// ----------------------------- END STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (BAR CHART) ---------------------------

})(window.Bisnis || {});