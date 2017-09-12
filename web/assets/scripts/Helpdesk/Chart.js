(function (Bisnis) {

    var arrayStatus = [
        0,
        0,
        0,
        0,
        0
    ];

    var arrayMonth = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];

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

    statusOpen(function (totalOpen) {
       arrayStatus[0] = totalOpen;
       statusClosed(function (totalClosed) {
           arrayStatus[4] = totalClosed;
           statusAssignment(function (totalAssignment) {
               arrayStatus[1] = totalAssignment;
               statusResolved(function (totalResolved) {
                   arrayStatus[3] = totalResolved;
                   statusOnProgress(function (totalOnProgress) {
                       arrayStatus[2] = totalOnProgress;

                       // ---------------- STATUS TICKET (LINE CHART) ---------------------------
                            var dataStatus = {
                                label: 'Status Tiket',
                                labels: ["Open", "Assignment", "On Progress", "Resolved", "Closed"],
                                datasets: [
                                    {
                                        fillColor: "rgba(99, 151, 207, 1)",
                                        strokeColor: "#145293",
                                        pointColor: "#fff",
                                        pointStrokeColor: "#11457d",
                                        // data : [203,156,99,251,305,247]
                                        data: [
                                            arrayStatus[0],
                                            arrayStatus[1],
                                            arrayStatus[2],
                                            arrayStatus[3],
                                            arrayStatus[4]
                                            // 43,10,1,4,6
                                        ]
                                    }
                                ]
                            }
                                       // get line chart canvas
                                       var statusTicket = document.getElementById('statusTicket').getContext('2d');
                                        // draw line chart
                                      new Chart(statusTicket).Line(dataStatus);
                                        // Chart.destroy();

                            // ------------ END STATUS TICKET (LINE CHART) -----------------------


                       })
                   })
               })
           })
       });

    //BERDASARKAN BULAN BUAT TIKET
    function createdAtChart(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [
                    {
                        value : 'createdAt'
                    }
                ]
            },
            success: function (data, textStatus, jqXHR) {

                var data = JSON.parse(data);
                var finalData = data['hydra:member'];

                if (finalData.length > 0) {
                    var total = 1;
                    $.each(finalData, function (index, value) {
                        var d = moment(value.createdAt).month(); // 8
                        total++;
                        // console.log('bulan',d,', jumlah data =',no);
                        if (callback) callback(d, total)
                    });
                }
            }
        });

    }
    createdAtChart(function (bulan, jml) {
        if(bulan === 0){
            arrayMonth[0] = jml;
        } else if(bulan === 1){
            arrayMonth[1] = jml;
        } else if(bulan === 2){
            arrayMonth[2] = jml;
        } else if(bulan === 3){
            arrayMonth[3] = jml;
        } else if(bulan === 4){
            arrayMonth[4] = jml;
        } else if(bulan === 5){
            arrayMonth[5] = jml;
        } else if(bulan === 6){
            arrayMonth[6] = jml;
        } else if(bulan === 7){
            arrayMonth[7] = jml;
        } else if(bulan === 8){
            arrayMonth[8] = jml;
        } else if(bulan === 9){
            arrayMonth[9] = jml;
        } else if(bulan === 10){
            arrayMonth[10] = jml;
        } else if(bulan === 11){
            arrayMonth[11] = jml;
        }
        // ----------------------------- STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (BAR CHART) ---------------------------
        var barData = {
            labels : ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
            datasets : [
                {
                    fillColor : "#145293",
                    strokeColor : "#11457d",
                    data : [
                        arrayMonth[0],
                        arrayMonth[1],
                        arrayMonth[2],
                        arrayMonth[3],
                        arrayMonth[4],
                        arrayMonth[5],
                        arrayMonth[6],
                        arrayMonth[7],
                        arrayMonth[8],
                        arrayMonth[9],
                        arrayMonth[10],
                        arrayMonth[11]
                    ]
                }//,
                // {
                //     fillColor : "rgba(73,188,170,0.4)",
                //     strokeColor : "rgba(72,174,209,0.4)",
                //     data : [364,504,605,400,345,320]
                // }
            ]
        }
// get bar chart canvas
        var createdTicket = document.getElementById("createdTicket").getContext("2d");
// draw bar chart
        new Chart(createdTicket).Bar(barData);
        // Chart.destroy();
// ----------------------------- END STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (BAR CHART) ---------------------------
    });


})(window.Bisnis || {});