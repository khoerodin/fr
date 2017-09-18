(function (Bisnis) {

    var arrayStatus = [0,0,0,0,0];
    var arrayMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
    var arrayStaff = [0,0,0,0,0,0];
    var arrayCatID = [0,0,0,0,0,0,0,0,0];

    //STATUS OPEN
    function statusOpen(callback) {
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
    function statusAssignment(callback) {
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
    function statusOnProgress(callback) {
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
    function statusResolved(callback) {
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
    function statusClosed(callback) {
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

                       // ---------------- STATUS TICKET (PIE CHART) ---------------------------

                       var statusCanvas = document.getElementById("statusTicketChart");

                       Chart.defaults.global.defaultFontFamily = "Lato";
                       Chart.defaults.global.defaultFontSize = 12;

                       var statusData = {
                           labels: ["Open", "Assignment", "On Progress", "Resolved", "Closed"],
                           datasets: [
                               {
                                   data: [arrayStatus[0],arrayStatus[1],arrayStatus[2],arrayStatus[3],arrayStatus[4]],
                                   backgroundColor: [
                                       "#145293",
                                       "#2E6CAD",
                                       "#7AB8F9",
                                       "#93D1FF",
                                       "#C7FFFF"
                                   ]
                               }]
                       };
                       var pieChart = new Chart(statusCanvas, {
                           type: 'pie',
                           data: statusData
                       });
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
                params: [{'createdAt' : {'after':'2017-01-01'}},{'createdAt':{'before': '2017-01-30'}}]
            },
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartFeb(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-02-01'}},{'createdAt' : {'before': '2017-02-28'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartMar(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-03-01'}},{'createdAt' : {'before': '2017-03-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartApr(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-04-01'}},{'createdAt' : {'before': '2017-04-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartMei(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-05-01'}},{'createdAt' : {'before': '2017-05-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartJun(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-06-01'}},{'createdAt' : {'before': '2017-06-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartJul(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-07-01'}},{'createdAt' : {'before': '2017-07-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartAgust(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-08-01'}},{'createdAt' : {'before': '2017-08-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
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
                params: [
                    {'createdAt' : {'after': '2017-09-01'}},{'createdAt' : {'before': '2017-09-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartOkt(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-10-01'}},{'createdAt' : {'before': '2017-10-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)
            }
        });

    }
    function createdAtChartNov(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-11-01'}},{'createdAt' : {'before': '2017-11-30'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
                    if (callback) callback(total)

            }
        });

    }
    function createdAtChartDes(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {module: 'helpdesk/tickets',method: 'get',
                params: [{'createdAt' : {'after':'2017-12-01'}},{'createdAt' : {'before': '2017-12-31'}}]},
            success: function (data, textStatus, jqXHR) {
                var data = JSON.parse(data);
                var total = data['hydra:totalItems'];
                    console.log(total);
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
                                                    // ------- STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (PIE CHART) -------------

                                                    var createdAtCanvas = document.getElementById("createdTicketChart");

                                                    Chart.defaults.global.defaultFontFamily = "Lato";
                                                    Chart.defaults.global.defaultFontSize = 12;

                                                    var createData = {
                                                        labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                                                        datasets: [
                                                            {
                                                                data: [arrayMonth[0], arrayMonth[1], arrayMonth[2], arrayMonth[3], arrayMonth[4], arrayMonth[5], arrayMonth[6], arrayMonth[7], arrayMonth[8], arrayMonth[9], arrayMonth[10], arrayMonth[11]],
                                                                backgroundColor: [
                                                                    "#e6194b",
                                                                    "#3cb44b",
                                                                    "#ffe119",
                                                                    "#0082c8",
                                                                    "#f58231",
                                                                    "#911eb4",
                                                                    "#46f0f0",
                                                                    "#f032e6",
                                                                    "#d2f53c",
                                                                    "#fabebe",
                                                                    "#008080",
                                                                    "#e6beff",
                                                                    "#aa6e28"
                                                                ]
                                                            }]
                                                    };
                                                    if (window.bar !== undefined) {
                                                        window.bar.destroy();
                                                    }
                                                    window.bar = new Chart(createdAtCanvas, {
                                                        type: 'pie',
                                                        data: createData
                                                    // --- END STATISTIK BERDASARKAN WAKTU TAMBAH TICKET (PIE CHART) ---
                                                    });
                                                });
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



    //BERDASARKAN STAFF
    function staffChart_0(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'staff.id' : '004d085d-7daf-11e7-bcb2-f0921c15b764'}] //firli
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
                params: [{'staff.id' : '169f71db-7daf-11e7-bcb2-f0921c15b764'}] //khoerodin
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
                params: [{'staff.id' : '4ed426c3-7dae-11e7-bcb2-f0921c15b764'}] //daniel
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
                params: [{'staff.id' : '691b6159-946e-11e7-bcb2-f0921c15b764'}] //uyi
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
                params: [{'staff.id' : 'bcdc673f-92d4-11e7-bcb2-f0921c15b764'}] //aden
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
                params: [{'staff.id' : 'eda89092-7dae-11e7-bcb2-f0921c15b764'}] //dhika
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
                            Chart.defaults.global.defaultFontSize = 12;

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
                                    }]
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

    //BERDASARKAN KATEGORI
    function categoryChart0(callback) {
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {
                module: 'helpdesk/tickets',
                method: 'get',
                params: [{'category.id' : '1aae1d60-5264-11e7-b9c9-f0921c15b764'}]}, //TEST
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
                params: [{'category.id' : '254b8e26-5264-11e7-b9c9-f0921c15b764'}]}, //COBA
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
                params: [{'category.id' : '2ff07822-5624-11e7-bcb2-f0921c15b764'}]}, //LAYANAN DATA DAN TABEL
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
                params: [{'category.id' : '34ca01b9-5624-11e7-bcb2-f0921c15b764'}]}, //OPERASI PRODUKSI
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
                params: [{'category.id' : '39c3b1c8-5624-11e7-bcb2-f0921c15b764'}]}, //HARDWARE DAN INFRASTRUKTUR
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
                params: [{'category.id' : '49bf2b6e-5264-11e7-b9c9-f0921c15b764'}]}, //SEKRETARIAT PRODUKSI
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
                params: [{'category.id' : 'b03f4d51-5621-11e7-bcb2-f0921c15b764'}]}, //PUSTAKA, DOKUMENTASI, DAN ARSIP
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
                params: [{'category.id' : 'b076c3f1-5624-11e7-bcb2-f0921c15b764'}]}, //MANAGEMENT INFORMATION SYSTEM (MIS)
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
                params: [{'category.id' : 'e7903dc8-5488-11e7-bcb2-f0921c15b764'}]}, //MONETISASI DATA
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
                                        Chart.defaults.global.defaultFontSize = 10;

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
                                                }]
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

})(window.Bisnis || {});