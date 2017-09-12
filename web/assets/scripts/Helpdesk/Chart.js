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

                            // ------------ END STATUS TICKET (LINE CHART) -----------------------


                       })
                   })
               })
           })
       });

    //BERDASARKAN WAKTU
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

                $.each(finalData, function (index, value) {

                    var d = moment(value.createdAt).month(); // 8

                    console.log(d);
                    if(callback) callback(d)

                });
            }
        });

    }
    createdAtChart(function (totalTime) {

        arrayMonth[0] = totalTime;
        arrayMonth[1] = totalTime;
        arrayMonth[2] = totalTime;
        arrayMonth[3] = totalTime;
        arrayMonth[4] = totalTime;
        arrayMonth[5] = totalTime;
        arrayMonth[6] = totalTime;
        arrayMonth[7] = totalTime;
        arrayMonth[8] = totalTime;
        arrayMonth[9] = totalTime;
        arrayMonth[10] = totalTime;
        arrayMonth[11] = totalTime;
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
// ----------------------------- END STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (BAR CHART) ---------------------------
    });






})(window.Bisnis || {});