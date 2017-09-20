(function (Bisnis) {

    var arrayStatus = [0,0,0,0,0];
    var arrayPriority = [0,0,0,0];
    var arrayPriorityStaff = [0,0,0,0];
    var arrayStatusStaff = [0,0,0,0];
    var arrayMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
    var arrayStaff = [0,0,0,0,0,0];
    var arrayCatID = [0,0,0,0,0,0,0,0,0];

    //STATUS OPEN
    function allStatusOpen(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'status' : 'open'}]
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
    function allStatusAssignment(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'status' : 'assignment'}]
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
    function allStatusOnProgress(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'status' : 'onprogress'}]
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
    function allStatusResolved(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'status' : 'resolved'}]
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
    function allStatusClosed(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'status' : 'closed'}]
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)
            }
        });
    }

    allStatusOpen(function (totalOpen) {
       arrayStatus[0] = totalOpen;
       allStatusClosed(function (totalClosed) {
           arrayStatus[4] = totalClosed;
           allStatusAssignment(function (totalAssignment) {
               arrayStatus[1] = totalAssignment;
               allStatusResolved(function (totalResolved) {
                   arrayStatus[3] = totalResolved;
                   allStatusOnProgress(function (totalOnProgress) {
                       arrayStatus[2] = totalOnProgress;

                       // ---------------- STATUS TICKET (PIE CHART) ---------------------------

                       var statusCanvas = document.getElementById("statusTicketChart");

                       Chart.defaults.global.defaultFontFamily = "Lato";
                       Chart.defaults.global.defaultFontSize = 14;

                       var statusData = {
                           labels: ["Open", "Assignment", "On Progress", "Resolved", "Closed"],
                           datasets: [
                               {
                                   data: [arrayStatus[0],arrayStatus[1],arrayStatus[2],arrayStatus[3],arrayStatus[4]],
                                   backgroundColor: [
                                       "#DBDBDB",
                                       "#3c8dbc",
                                       "#f39c12",
                                       "#00a65a",
                                       "#d73925"
                                   //    aaaa
                                   ]
                               }],
                           options: {
                               layout: {
                                   padding: {
                                       left: 50,
                                       right: 0,
                                       top: 50,
                                       bottom: 0
                                   }
                               },
                               legend: {
                                   display: true,
                                   labels: {
                                       fontColor: 'rgb(255, 99, 132)'
                                   }
                               }
                           }
                       };
                       var pieChart = new Chart(statusCanvas, {
                           type: 'pie',
                           data: statusData
                       });

                       statusCanvas.onclick = function(evt) {
                           var activePoints = pieChart.getElementsAtEvent(evt);
                           if (activePoints[0]) {
                               var chartData = activePoints[0]['_chart'].config.data;
                               var idx = activePoints[0]['_index'];

                               var label = chartData.labels[idx];
                               var value = chartData.datasets[0].data[idx];

                               var url = "http://example.com/?label=" + label + "&value=" + value;
                               console.log(url);
                               alert(url);
                           }
                       };
                   });
                           // ------------ END STATUS TICKET (PIE CHART) -----------------------
                   })
               })
           })
       });

    //BERDASARKAN BULAN BUAT TIKET
    function createdAtChartJan(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-01-01','before': '2017-01-31'}}]
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartFeb(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-02-01','before': '2017-02-28'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartMar(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-03-01','before': '2017-03-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartApr(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-04-01','before': '2017-04-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartMei(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-05-01','before': '2017-05-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartJun(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-06-01','before': '2017-06-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartJul(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-07-01','before': '2017-07-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartAgust(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'createdAt' : {'after':'2017-08-01','before': '2017-08-31'}}]},
                    success: function (data, textStatus, jqXHR) {
                    var data = JSON.parse(data);
                    var total = data['hydra:totalItems'];
                        // console.log(total);
                        if (callback) callback(total)
                }
        });

    }
    function createdAtChartSept(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'createdAt' : {'after':'2017-09-01','before': '2017-09-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartOkt(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-10-01','before': '2017-10-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartNov(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-11-01','before': '2017-11-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)

            }
        });

    }
    function createdAtChartDes(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-12-01', 'before': '2017-12-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)

            }
        });

    }
    createdAtChartJan(function (total_0) {
        arrayMonth[0] = total_0;
        createdAtChartFeb(function (total_1) {
            arrayMonth[1] = total_1;
            createdAtChartMar(function (total_2) {
                arrayMonth[2] = total_2;
                createdAtChartApr(function (total_3) {
                    arrayMonth[3] = total_3;
                    createdAtChartMei(function (total_4) {
                        arrayMonth[4] = total_4;
                        createdAtChartJun(function (total_5) {
                            arrayMonth[5] = total_5;
                            createdAtChartJul(function (total_6) {
                                arrayMonth[6] = total_6;
                                createdAtChartAgust(function (total_7) {
                                    arrayMonth[7] = total_7;
                                    createdAtChartSept(function (total_8) {
                                        arrayMonth[8] = total_8;
                                        createdAtChartOkt(function (total_9) {
                                            arrayMonth[9] = total_9;
                                            createdAtChartNov(function (total_10) {
                                                arrayMonth[10] = total_10;
                                                createdAtChartDes(function (total_11) {
                                                    arrayMonth[11] = total_11;
                                                    // ------- STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (LINE CHART) -------------

                                                    var createdAtCanvas = document.getElementById("createdTicketChart");

                                                    Chart.defaults.global.defaultFontFamily = "Lato";
                                                    Chart.defaults.global.defaultFontSize = 14;

                                                    // createdAtCanvas.onclick = function(evt) {
                                                    //     var activePoints = barChartMonth.getElementsAtEvent(evt);
                                                    //     if (activePoints[0]) {
                                                    //         var chartData = activePoints[0]['_chart'].config.data;
                                                    //         var idx = activePoints[0]['_index'];
                                                    //
                                                    //         var label = chartData.labels[idx];
                                                    //         var value = chartData.datasets[0].data[idx];
                                                    //
                                                    //         //STATUS ASSIGNMENT
                                                    //         function statusAssignment(callback) {
                                                    //             $.ajax({
                                                    //                 url: '/api',
                                                    //                 type: 'POST',
                                                    //                 data: {
                                                    //                     module: 'helpdesk/tickets',
                                                    //                     method: 'get',
                                                    //                     params: [{'status': 'assignment'},{'staff.user.id': $('#currentUser').text()}]
                                                    //                 },
                                                    //                 success: function (data, textStatus, jqXHR) {
                                                    //                     var data = JSON.parse(data);
                                                    //                     var total = data['hydra:totalItems'];
                                                    //                     // console.log(total);
                                                    //                     if (callback) callback(total)
                                                    //                 }
                                                    //             });
                                                    //         }
                                                    //
                                                    //         //STATUS ON PROGRESS
                                                    //         function statusOnProgress(callback) {
                                                    //             $.ajax({
                                                    //                 url: '/api',
                                                    //                 type: 'POST',
                                                    //                 data: {
                                                    //                     module: 'helpdesk/tickets',
                                                    //                     method: 'get',
                                                    //                     params: [{'status': 'onprogress'}, {'staff.user.id': $('#currentUser').text()}]
                                                    //                 },
                                                    //                 success: function (data, textStatus, jqXHR) {
                                                    //                     var data = JSON.parse(data);
                                                    //                     var total = data['hydra:totalItems'];
                                                    //                     // console.log(total);
                                                    //                     if (callback) callback(total)
                                                    //                 }
                                                    //             });
                                                    //
                                                    //         }
                                                    //
                                                    //         //STATUS RESOLVED
                                                    //         function statusResolved(callback) {
                                                    //             $.ajax({
                                                    //                 url: '/api',
                                                    //                 type: 'POST',
                                                    //                 data: {
                                                    //                     module: 'helpdesk/tickets',
                                                    //                     method: 'get',
                                                    //                     params: [{'status': 'resolved'}, {'staff.user.id': $('#currentUser').text()}]
                                                    //                 },
                                                    //                 success: function (data, textStatus, jqXHR) {
                                                    //                     var data = JSON.parse(data);
                                                    //                     var total = data['hydra:totalItems'];
                                                    //                     // console.log(total);
                                                    //                     if (callback) callback(total)
                                                    //                 }
                                                    //             });
                                                    //
                                                    //         }
                                                    //
                                                    //         //STATUS CLOSED
                                                    //         function statusClosed(callback) {
                                                    //             $.ajax({
                                                    //                 url: '/api',
                                                    //                 type: 'POST',
                                                    //                 data: {
                                                    //                     module: 'helpdesk/tickets',
                                                    //                     method: 'get',
                                                    //                     params: [{'status': 'closed'}, {'staff.user.id': $('#currentUser').text()}]
                                                    //                 },
                                                    //                 success: function (data, textStatus, jqXHR) {
                                                    //                     var data = JSON.parse(data);
                                                    //                     var total = data['hydra:totalItems'];
                                                    //                     // console.log(total);
                                                    //                     if (callback) callback(total)
                                                    //                 }
                                                    //             });
                                                    //         }
                                                    //             statusClosed(function (totalClosed) {
                                                    //                 arrayStatusStaff[3] = totalClosed;
                                                    //                 statusAssignment(function (totalAssignment) {
                                                    //                     arrayStatusStaff[0] = totalAssignment;
                                                    //                     statusResolved(function (totalResolved) {
                                                    //                         arrayStatusStaff[2] = totalResolved;
                                                    //                         statusOnProgress(function (totalOnProgress) {
                                                    //                             arrayStatusStaff[1] = totalOnProgress;
                                                    //
                                                    //                             // ---------------- STATUS TICKET (PIE CHART) ---------------------------
                                                    //
                                                    //                             var statusStaffCanvas = document.getElementById("statusStaffChart");
                                                    //
                                                    //                             Chart.defaults.global.defaultFontFamily = "Lato";
                                                    //                             Chart.defaults.global.defaultFontSize = 12;
                                                    //
                                                    //                             var statusDataStaff = {
                                                    //                                 labels: ["Assignment", "On Progress", "Resolved", "Closed"],
                                                    //                                 datasets: [
                                                    //                                     {
                                                    //                                         data: [arrayStatusStaff[0], arrayStatusStaff[1], arrayStatusStaff[2], arrayStatusStaff[3]],
                                                    //                                         backgroundColor: [
                                                    //                                             "#3c8dbc",
                                                    //                                             "#f39c12",
                                                    //                                             "#00a65a",
                                                    //                                             "#d73925"
                                                    //                                         ]
                                                    //                                     }],
                                                    //                                 options: {
                                                    //                                     layout: {
                                                    //                                         padding: {
                                                    //                                             left: 50,
                                                    //                                             right: 0,
                                                    //                                             top: 50,
                                                    //                                             bottom: 0
                                                    //                                         }
                                                    //                                     }
                                                    //                                 }
                                                    //                             };
                                                    //                             var pieChart = new Chart(statusStaffCanvas, {
                                                    //                                 type: 'pie',
                                                    //                                 data: statusDataStaff
                                                    //                             });
                                                    //
                                                    //
                                                    //                             $('#modalDetailMonth').modal({
                                                    //                                 show: true,
                                                    //                                 backdrop: 'static'
                                                    //                             });
                                                    //
                                                    //                             $('#modalDetailMonth #bulan').html('bulan ' + label);
                                                    //                             $('#modalDetailMonth #assignment').html(arrayStatusStaff[0]);
                                                    //                             $('#modalDetailMonth #onprogress').html(arrayStatusStaff[1]);
                                                    //                             $('#modalDetailMonth #resolved').html(arrayStatusStaff[2]);
                                                    //                             $('#modalDetailMonth #closed').html(arrayStatusStaff[3]);
                                                    //                             // $('#modalDetailMonth #total').html(value);
                                                    //                         })
                                                    //                     })
                                                    //                 })
                                                    //             })
                                                    //     }
                                                    //
                                                    // };

                                                    // var ctx = document.getElementById("createdTicketChart").getContext('2d');
                                                    // var barChartMonth = new Chart(ctx, {
                                                    //     type: 'bar',
                                                    //     data: {
                                                    //         labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                                                    //         datasets: [{
                                                    //             // label: '# of Votes',
                                                    //             data: [arrayMonth[0], arrayMonth[1], arrayMonth[2], arrayMonth[3], arrayMonth[4], arrayMonth[5], arrayMonth[6], arrayMonth[7], arrayMonth[8], arrayMonth[9], arrayMonth[10], arrayMonth[11]],
                                                    //             backgroundColor: [
                                                    //                 'rgb(230, 25, 75)','rgb(60, 180, 75)','rgb(255, 225, 25)','rgb(0, 130, 200)','rgb(245, 130, 49)','rgb(145, 30, 180)','rgb(70, 240, 240)','rgb(240, 50, 230)','rgb(210, 245, 60)','rgb(250, 190, 190)','rgb(0, 128, 128)','rgb(230, 190, 255)','rgb(170, 110, 40)'
                                                    //             ],
                                                    //             borderColor: [
                                                    //                 'rgb(255, 140, 190)','rgb(137, 255, 152)','rgb(255, 255, 140)','rgb(115, 245, 255)','rgb(255, 207, 126)','rgb(255, 145, 255)','rgb(185, 255, 255)','rgb(255, 165, 255)','rgb(255, 255, 175)','rgb(255, 228, 228)','rgb(115, 243, 243)','rgb(255, 228, 255)'
                                                    //             ],
                                                    //             borderWidth: 1
                                                    //         }]
                                                    //     },
                                                    //     options: {
                                                    //         scales: {
                                                    //             yAxes: [{
                                                    //                 scaleLabel: {
                                                    //                     display: true,
                                                    //                     labelString: 'Jumlah Tiket'
                                                    //                 },
                                                    //                 ticks: {
                                                    //                     beginAtZero: true,
                                                    //                     callback: function(value, index, values) {
                                                    //                         return value + ' Tiket';
                                                    //                     }
                                                    //                 }
                                                    //             }]
                                                    //         },
                                                    //         legend: {
                                                    //             display: false
                                                    //         }
                                                    //     }
                                                    // });
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    });
    //BERDASARKAN TOTAL TIKET DARI SEORANG STAFF
    function totalbyStaff(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.user.id' : $('#currentUser').text()}]
            },
            success: function (data, textStatus, jqXHR) {
                    var data = JSON.parse(data);
                    var total = data['hydra:totalItems'];
                    // console.log(total);
                    if (callback) callback(total)
            }
        });
    }
    totalbyStaff();


    //BERDASARKAN ANDA SEBAGAI CLIENT DAN STAFF YANG MENGERJAKAN TIKET ANDA
    function staffChart_0(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : '004d085d-7daf-11e7-bcb2-f0921c15b764'},{'client.id' : $('#currentUser').text()}] //firli
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                if(callback) callback(total)
            }
        });
    }

    function staffChart_1(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : '169f71db-7daf-11e7-bcb2-f0921c15b764'},{'client.id' : $('#currentUser').text()}] //khoerodin
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                if(callback) callback(total)
            }
        });
    }

    function staffChart_2(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : '4ed426c3-7dae-11e7-bcb2-f0921c15b764'},{'client.id' : $('#currentUser').text()}] //daniel
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                if(callback) callback(total)
            }
        });
    }

    function staffChart_3(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : '691b6159-946e-11e7-bcb2-f0921c15b764'},{'client.id' : $('#currentUser').text()}] //uyi
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                if(callback) callback(total)
            }
        });
    }

    function staffChart_4(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : 'bcdc673f-92d4-11e7-bcb2-f0921c15b764'},{'client.id' : $('#currentUser').text()}] //aden
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                if(callback) callback(total)
            }
        });
    }

    function staffChart_5(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : 'eda89092-7dae-11e7-bcb2-f0921c15b764'},{'client.id' : $('#currentUser').text()}] //dhika
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                if(callback) callback(total)
            }
        });
    }

    staffChart_0(function (total_0) {
        arrayStaff[0] = total_0;
        staffChart_1(function (total_1) {
            arrayStaff[1] = total_1;
            staffChart_2(function (total_2) {
                arrayStaff[2] = total_2;
                staffChart_3(function (total_3) {
                    arrayStaff[3] = total_3;
                    staffChart_4(function (total_4) {
                        arrayStaff[4] = total_4;
                        staffChart_5(function (total_5) {
                            arrayStaff[5] = total_5;

                            var staffCanvas = document.getElementById("staffChart");

                            Chart.defaults.global.defaultFontFamily = "Lato";
                            Chart.defaults.global.defaultFontSize = 14;

                            var staffData = {
                                labels: [
                                    "Firli",
                                    "Khoerodin",
                                    "Daniel",
                                    "Uyi",
                                    "Aden",
                                    "Dhika"
                                ],
                                datasets: [
                                    {
                                        data: [arrayStaff[0], arrayStaff[1], arrayStaff[2], arrayStaff[3], arrayStaff[4], arrayStaff[5]],
                                        backgroundColor: [
                                            "#D4630C",
                                            "#e6751e",
                                            "#FF9942",
                                            "#FFBC65",
                                            "#FFE089",
                                            "#FFFFAD"
                                        ]
                                    }],
                                options: {
                                    layout: {
                                        padding: {
                                            left: 50,
                                            right: 0,
                                            top: 50,
                                            bottom: 0
                                        }
                                    }
                                }
                            };
                            // if (window.bar !== undefined) {
                            //     window.bar.destroy();
                            // }
                            // window.bar = new Chart(staffCanvas, {
                            var pieChart8 = new Chart(staffCanvas, {
                                type: 'pie',
                                data: staffData
                            });
                        });
                    })
                })
            })
        })
    });

    //BERDASARKAN KATEGORI YANG DI ASSIGN KE STAFF
    function categoryChart0(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '1aae1d60-5264-11e7-b9c9-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //TEST
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart1(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '254b8e26-5264-11e7-b9c9-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //COBA
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart2(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '2ff07822-5624-11e7-bcb2-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //LAYANAN DATA DAN TABEL
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart3(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '34ca01b9-5624-11e7-bcb2-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //OPERASI PRODUKSI
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart4(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '39c3b1c8-5624-11e7-bcb2-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //HARDWARE DAN INFRASTRUKTUR
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart5(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '49bf2b6e-5264-11e7-b9c9-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //SEKRETARIAT PRODUKSI
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart6(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : 'b03f4d51-5621-11e7-bcb2-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //PUSTAKA, DOKUMENTASI, DAN ARSIP
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart7(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : 'b076c3f1-5624-11e7-bcb2-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //MANAGEMENT INFORMATION SYSTEM (MIS)
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }
    function categoryChart8(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : 'e7903dc8-5488-11e7-bcb2-f0921c15b764'},{'staff.user.id' : $('#currentUser').text()}]}, //MONETISASI DATA
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data);
                        var total = data['hydra:totalItems'];
                        if (callback) callback(total)
                    }
            });
    }


    categoryChart0(function (total_0) {
        arrayCatID[0] = total_0;
        categoryChart1(function (total_1) {
            arrayCatID[1] = total_1;
            categoryChart2(function (total_2) {
                arrayCatID[2] = total_2;
                categoryChart3(function (total_3) {
                    arrayCatID[3] = total_3;
                    categoryChart4(function (total_4) {
                        arrayCatID[4] = total_4;
                        categoryChart5(function (total_5) {
                            arrayCatID[5] = total_5;
                            categoryChart6(function (total_6) {
                                arrayCatID[6] = total_6;
                                categoryChart7(function (total_7) {
                                    arrayCatID[7] = total_7;
                                    categoryChart8(function (total_8) {
                                        arrayCatID[8] = total_8;


                                        var categoryCanvas = document.getElementById("categoryTicketChart");

                                        Chart.defaults.global.defaultFontFamily = "Lato";
                                        Chart.defaults.global.defaultFontSize = 14;

                                        var categoryData = {
                                            labels: [
                                                "Test",
                                                "Coba",
                                                "Layanan Data Tabel",
                                                "Operasi Produksi",
                                                "Hardware & Infrastruktur",
                                                "Sekretariat Produksi",
                                                "Pustaka, Arsip dan Dokumentasi",
                                                "Management Information System",
                                                "Monetisasi Data"

                                            ],
                                            datasets: [
                                                {
                                                    data: [arrayCatID[0], arrayCatID[1], arrayCatID[2], arrayCatID[3], arrayCatID[4], arrayCatID[5], arrayCatID[6], arrayCatID[7], arrayCatID[8]],
                                                    backgroundColor: [
                                                        "#5D00B0",
                                                        "#771ACA",
                                                        "#9033E3",
                                                        "#AA4DFD",
                                                        "#C366FF",
                                                        "#DC7FFF",
                                                        "#F699FF",
                                                        "#FFB3FF",
                                                        "#DB66FF"
                                                    ]
                                                }],
                                            options: {
                                                layout: {
                                                    padding: {
                                                        left: 50,
                                                        right: 0,
                                                        top: 50,
                                                        bottom: 0
                                                    }
                                                }
                                            }
                                        };
                                        // if (window.bar !== undefined) {
                                        //     window.bar.destroy();
                                        // }
                                        // window.bar = new Chart(categoryCanvas, {
                                        var pieChart12 = new Chart(categoryCanvas, {
                                            type: 'pie',
                                            data: categoryData
                                        });
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    });

    //BERDASARKAN PRIORITAS DARI STAFF
    function priorityChart1(callback) { //very urgent
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'priority' : 'very_urgent'}]
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
    function priorityChart2(callback) { //urgent
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'priority' : 'urgent'}]
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
    function priorityChart3(callback) { //normal
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'priority' : 'normal'}]
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
    function priorityChart4(callback) { //low
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'priority' : 'low'}]
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                // alert(total);
                if(callback) callback(total)
            }
        });
    }

    priorityChart1(function (totalClosed) {
        arrayStatusStaff[3] = totalClosed;
        priorityChart2(function (totalAssignment) {
            arrayStatusStaff[0] = totalAssignment;
            priorityChart3(function (totalResolved) {
                arrayStatusStaff[2] = totalResolved;
                priorityChart4(function (totalOnProgress) {
                    arrayStatusStaff[1] = totalOnProgress;
                })
            })
        })
    });


})(window.Bisnis || {});