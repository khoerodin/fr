
var arrayStatusStaff = [0,0,0,0];
var arrayMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
var arrayOpen = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var arrayAssignment = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var arrayOnprogress = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var arrayResolved = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var arrayClosed = [0,0,0,0,0,0,0,0,0,0,0,0,0];

//OPEN
function openChartJan(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-01-01','before': '2017-01-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartFeb(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-02-01','before': '2017-01-28'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartMar(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-03-01','before': '2017-03-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartApr(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-04-01','before': '2017-04-30'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartMei(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-05-01','before': '2017-05-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartJun(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-06-01','before': '2017-06-30'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartJul(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-07-01','before': '2017-07-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartAgust(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-08-01','before': '2017-08-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartSept(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-09-01','before': '2017-09-30'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartOkt(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-10-01','before': '2017-10-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartNov(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-11-01','before': '2017-11-30'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function openChartDes(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-12-01','before': '2017-12-31'}},{'status':'open'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}

//ASSIGNMENT
function assignmentChartJan(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-01-01','before': '2017-01-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartFeb(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-02-01','before': '2017-01-28'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartMar(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-03-01','before': '2017-03-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartApr(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-04-01','before': '2017-04-30'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartMei(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-05-01','before': '2017-05-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartJun(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-06-01','before': '2017-06-30'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartJul(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-07-01','before': '2017-07-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartAgust(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-08-01','before': '2017-08-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartSept(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-09-01','before': '2017-09-30'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartOkt(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-10-01','before': '2017-10-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartNov(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-11-01','before': '2017-11-30'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function assignmentChartDes(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-12-01','before': '2017-12-31'}},{'status':'assignment'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}

//ON PROGRESS
function onprogressChartJan(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-01-01','before': '2017-01-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartFeb(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-02-01','before': '2017-01-28'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartMar(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-03-01','before': '2017-03-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartApr(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-04-01','before': '2017-04-30'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartMei(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-05-01','before': '2017-05-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartJun(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-06-01','before': '2017-06-30'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartJul(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-07-01','before': '2017-07-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartAgust(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-08-01','before': '2017-08-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartSept(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-09-01','before': '2017-09-30'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartOkt(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-10-01','before': '2017-10-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartNov(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-11-01','before': '2017-11-30'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function onprogressChartDes(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-12-01','before': '2017-12-31'}},{'status':'onprogress'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}

//RESOLVED
function resolvedChartJan(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-01-01','before': '2017-01-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartFeb(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-02-01','before': '2017-01-28'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartMar(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-03-01','before': '2017-03-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartApr(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-04-01','before': '2017-04-30'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartMei(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-05-01','before': '2017-05-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartJun(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-06-01','before': '2017-06-30'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartJul(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-07-01','before': '2017-07-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartAgust(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-08-01','before': '2017-08-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartSept(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-09-01','before': '2017-09-30'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartOkt(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-10-01','before': '2017-10-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartNov(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-11-01','before': '2017-11-30'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function resolvedChartDes(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-12-01','before': '2017-12-31'}},{'status':'resolved'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}

//CLOSED
function closedChartJan(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-01-01','before': '2017-01-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartFeb(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-02-01','before': '2017-01-28'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartMar(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-03-01','before': '2017-03-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartApr(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-04-01','before': '2017-04-30'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartMei(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-05-01','before': '2017-05-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartJun(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-06-01','before': '2017-06-30'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartJul(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-07-01','before': '2017-07-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartAgust(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-08-01','before': '2017-08-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartSept(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-09-01','before': '2017-09-30'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartOkt(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-10-01','before': '2017-10-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartNov(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-11-01','before': '2017-11-30'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}
function closedChartDes(callback) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {module: 'helpdesk/tickets',method: 'get',
            params: [{'createdAt' : {'after':'2017-12-01','before': '2017-12-31'}},{'status':'closed'}]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var total = data['hydra:totalItems'];
            // console.log(total);
            if (callback) callback(total)
        }
    });

}

openChartJan(function (openJanTotal) {
    arrayOpen[0] = openJanTotal;
    openChartFeb(function (openFebTotal) {
        arrayOpen[1] = openFebTotal;
        openChartMar(function (openMarTotal) {
            arrayOpen[2] = openMarTotal;
            openChartApr(function (openAprTotal) {
                arrayOpen[3] = openAprTotal;
                openChartMei(function (openMeiTotal) {
                    arrayOpen[4] = openMeiTotal;
                    openChartJun(function (openJunTotal) {
                        arrayOpen[5] = openJunTotal;
                        openChartJul(function (openJulTotal) {
                            arrayOpen[6] = openJulTotal;
                            openChartAgust(function (openAgustTotal) {
                                arrayOpen[7] = openAgustTotal;
                                openChartSept(function (openSeptTotal) {
                                    arrayOpen[8] = openSeptTotal;
                                    openChartOkt(function (openOktTotal) {
                                        arrayOpen[9] = openOktTotal;
                                        openChartNov(function (openNovTotal) {
                                            arrayOpen[10] = openNovTotal;
                                            openChartDes(function (openDesTotal) {
                                                arrayOpen[11] = openDesTotal;
                                                assignmentChartJan(function (assJanTotal) {
                                                    arrayAssignment[0] = assJanTotal;
                                                    assignmentChartFeb(function (assFebTotal) {
                                                        arrayAssignment[1] = assFebTotal;
                                                        assignmentChartMar(function (assMarTotal) {
                                                            arrayAssignment[2] = assMarTotal;
                                                            assignmentChartApr(function (assAprTotal) {
                                                                arrayAssignment[3] = assAprTotal;
                                                                assignmentChartMei(function (assMeiTotal) {
                                                                    arrayAssignment[4] = assMeiTotal;
                                                                    assignmentChartJun(function (assJunTotal) {
                                                                        arrayAssignment[5] = assJunTotal;
                                                                        assignmentChartJul(function (assJulTotal) {
                                                                            arrayAssignment[6] = assJulTotal;
                                                                            assignmentChartAgust(function (assAgustTotal) {
                                                                                arrayAssignment[7] = assAgustTotal;
                                                                                assignmentChartSept(function (assSeptTotal) {
                                                                                    arrayAssignment[8] = assSeptTotal;
                                                                                    assignmentChartOkt(function (assOktTotal) {
                                                                                        arrayAssignment[9] = assOktTotal;
                                                                                        assignmentChartNov(function (assNovTotal) {
                                                                                            arrayAssignment[10] = assNovTotal;
                                                                                            assignmentChartDes(function (assDesTotal) {
                                                                                                arrayAssignment[11] = assDesTotal;
                                                                                                onprogressChartJan(function (onJanTotal) {
                                                                                                    arrayOnprogress[0] = onJanTotal;
                                                                                                    onprogressChartFeb(function (onFebTotal) {
                                                                                                        arrayOnprogress[1] = onFebTotal;
                                                                                                        onprogressChartMar(function (onMarTotal) {
                                                                                                            arrayOnprogress[2] = onMarTotal;
                                                                                                            onprogressChartApr(function (onAprTotal) {
                                                                                                                arrayOnprogress[3] = onAprTotal;
                                                                                                                onprogressChartMei(function (onMeiTotal) {
                                                                                                                    arrayOnprogress[4] = onMeiTotal;
                                                                                                                    onprogressChartJun(function (onJunTotal) {
                                                                                                                        arrayOnprogress[5] = onJunTotal;
                                                                                                                        onprogressChartJul(function (onJulTotal) {
                                                                                                                            arrayOnprogress[6] = onJulTotal;
                                                                                                                            onprogressChartAgust(function (onAgustTotal) {
                                                                                                                                arrayOnprogress[7] = onAgustTotal;
                                                                                                                                onprogressChartSept(function (onSeptTotal) {
                                                                                                                                    arrayOnprogress[8] = onSeptTotal;
                                                                                                                                    onprogressChartOkt(function (onOktTotal) {
                                                                                                                                        arrayOnprogress[9] = onOktTotal;
                                                                                                                                        onprogressChartNov(function (onNovTotal) {
                                                                                                                                            arrayOnprogress[10] = onNovTotal;
                                                                                                                                            onprogressChartDes(function (onDesTotal) {
                                                                                                                                                arrayOnprogress[11] = onDesTotal;
                                                                                                                                                resolvedChartJan(function (resJanTotal) {
                                                                                                                                                    arrayResolved[0] = resJanTotal;
                                                                                                                                                    resolvedChartFeb(function (resFebTotal) {
                                                                                                                                                        arrayResolved[1] = resFebTotal;
                                                                                                                                                        resolvedChartMar(function (resMarTotal) {
                                                                                                                                                            arrayResolved[2] = resMarTotal;
                                                                                                                                                            resolvedChartApr(function (resAprTotal) {
                                                                                                                                                                arrayResolved[3] = resAprTotal;
                                                                                                                                                                resolvedChartMei(function (resMeiTotal) {
                                                                                                                                                                    arrayResolved[4] = resMeiTotal;
                                                                                                                                                                    resolvedChartJun(function (resJunTotal) {
                                                                                                                                                                        arrayResolved[5] = resJunTotal;
                                                                                                                                                                        resolvedChartJul(function (resJulTotal) {
                                                                                                                                                                            arrayResolved[6] = resJulTotal;
                                                                                                                                                                            resolvedChartAgust(function (resAgustTotal) {
                                                                                                                                                                                arrayResolved[7] = resAgustTotal;
                                                                                                                                                                                resolvedChartSept(function (resSeptTotal) {
                                                                                                                                                                                    arrayResolved[8] = resSeptTotal;
                                                                                                                                                                                    resolvedChartOkt(function (resOktTotal) {
                                                                                                                                                                                        arrayResolved[9] = resOktTotal;
                                                                                                                                                                                        resolvedChartNov(function (resNovTotal) {
                                                                                                                                                                                            arrayResolved[10] = resNovTotal;
                                                                                                                                                                                            resolvedChartDes(function (resDesTotal) {
                                                                                                                                                                                                arrayResolved[11] = resDesTotal;
                                                                                                                                                                                                closedChartJan(function (closedJanTotal) {
                                                                                                                                                                                                    arrayClosed[0] = closedJanTotal;
                                                                                                                                                                                                    closedChartFeb(function (closedFebTotal) {
                                                                                                                                                                                                        arrayClosed[1] = closedFebTotal;
                                                                                                                                                                                                        closedChartMar(function (closedMarTotal) {
                                                                                                                                                                                                            arrayClosed[2] = closedMarTotal;
                                                                                                                                                                                                            closedChartApr(function (closedAprTotal) {
                                                                                                                                                                                                                arrayClosed[3] = closedAprTotal;
                                                                                                                                                                                                                closedChartMei(function (closedMeiTotal) {
                                                                                                                                                                                                                    arrayClosed[4] = closedMeiTotal;
                                                                                                                                                                                                                    closedChartJun(function (closedJunTotal) {
                                                                                                                                                                                                                        arrayClosed[5] = closedJunTotal;
                                                                                                                                                                                                                        closedChartJul(function (closedJulTotal) {
                                                                                                                                                                                                                            arrayClosed[6] = closedJulTotal;
                                                                                                                                                                                                                            closedChartAgust(function (closedAgustTotal) {
                                                                                                                                                                                                                                arrayClosed[7] = closedAgustTotal;
                                                                                                                                                                                                                                closedChartSept(function (closedSeptTotal) {
                                                                                                                                                                                                                                    arrayClosed[8] = closedSeptTotal;
                                                                                                                                                                                                                                    closedChartOkt(function (closedOktTotal) {
                                                                                                                                                                                                                                        arrayClosed[9] = closedOktTotal;
                                                                                                                                                                                                                                        closedChartNov(function (closedNovTotal) {
                                                                                                                                                                                                                                            arrayClosed[10] = closedNovTotal;
                                                                                                                                                                                                                                            closedChartDes(function (closedDesTotal) {
                                                                                                                                                                                                                                                arrayClosed[11] = closedDesTotal;

                                                                                                                                                                                                                                                //---------------------------------------------------- CHART HERE -------------------------------------

                                                                                                                                                                                                                                                var canvas2017 = document.getElementById("monthChart");

                                                                                                                                                                                                                                                Chart.defaults.global.defaultFontFamily = "Lato";
                                                                                                                                                                                                                                                Chart.defaults.global.defaultFontSize = 18;

                                                                                                                                                                                                                                                var openData = {
                                                                                                                                                                                                                                                    label: 'Open',
                                                                                                                                                                                                                                                    data: [arrayOpen[0],arrayOpen[1],arrayOpen[2],arrayOpen[3],arrayOpen[4],arrayOpen[5],arrayOpen[6],arrayOpen[7],arrayOpen[8],arrayOpen[9],arrayOpen[10],arrayOpen[11]],
                                                                                                                                                                                                                                                    backgroundColor: 'rgba(219, 219, 219, 1)',
                                                                                                                                                                                                                                                    borderWidth: 0
                                                                                                                                                                                                                                                    // yAxisID: "y-axis-open"
                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                var assignmentData = {
                                                                                                                                                                                                                                                    label: 'Assignment',
                                                                                                                                                                                                                                                    data: [arrayAssignment[0],arrayAssignment[1],arrayAssignment[2],arrayAssignment[3],arrayAssignment[4],arrayAssignment[5],arrayAssignment[6],arrayAssignment[7],arrayAssignment[8],arrayAssignment[9],arrayAssignment[10],arrayAssignment[11]],
                                                                                                                                                                                                                                                    backgroundColor: 'rgba(60, 141, 188, 1)',
                                                                                                                                                                                                                                                    borderWidth: 0
                                                                                                                                                                                                                                                    // yAxisID: "y-axis-assignment"
                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                var onprogressData = {
                                                                                                                                                                                                                                                    label: 'On Progress',
                                                                                                                                                                                                                                                    data: [arrayOnprogress[0],arrayOnprogress[1],arrayOnprogress[2],arrayOnprogress[3],arrayOnprogress[4],arrayOnprogress[5],arrayOnprogress[6],arrayOnprogress[7],arrayOnprogress[8],arrayOnprogress[9],arrayOnprogress[10],arrayOnprogress[11]],
                                                                                                                                                                                                                                                    backgroundColor: 'rgba(243, 156, 18, 1)',
                                                                                                                                                                                                                                                    borderWidth: 0
                                                                                                                                                                                                                                                    // yAxisID: "y-axis-onprogress"
                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                var resolvedData = {
                                                                                                                                                                                                                                                    label: 'Resolved',
                                                                                                                                                                                                                                                    data: [arrayResolved[0],arrayResolved[1],arrayResolved[2],arrayResolved[3],arrayResolved[4],arrayResolved[5],arrayResolved[6],arrayResolved[7],arrayResolved[8],arrayResolved[9],arrayResolved[10],arrayResolved[11]],
                                                                                                                                                                                                                                                    backgroundColor: 'rgba(0, 166, 90, 1)',
                                                                                                                                                                                                                                                    borderWidth: 0
                                                                                                                                                                                                                                                    // yAxisID: "y-axis-resolved"
                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                var closedData = {
                                                                                                                                                                                                                                                    label: 'Closed',
                                                                                                                                                                                                                                                    data: [arrayClosed[0],arrayClosed[1],arrayClosed[2],arrayClosed[3],arrayClosed[4],arrayClosed[5],arrayClosed[6],arrayClosed[7],arrayClosed[8],arrayClosed[9],arrayClosed[10],arrayClosed[11]],
                                                                                                                                                                                                                                                    backgroundColor: 'rgba(215, 57, 37, 1)',
                                                                                                                                                                                                                                                    borderWidth: 0
                                                                                                                                                                                                                                                    // yAxisID: "y-axis-closed"
                                                                                                                                                                                                                                                };



                                                                                                                                                                                                                                                var monthData = {
                                                                                                                                                                                                                                                    labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                                                                                                                                                                                                                                                    datasets: [openData, assignmentData,onprogressData,resolvedData,closedData]
                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                var chartOptions = {
                                                                                                                                                                                                                                                    scales: {
                                                                                                                                                                                                                                                        xAxes: [{

                                                                                                                                                                                                                                                        }],
                                                                                                                                                                                                                                                        yAxes: [{
                                                                                                                                                                                                                                                            //     id: "y-axis-open"
                                                                                                                                                                                                                                                            // }, {
                                                                                                                                                                                                                                                            //     id: "y-axis-assignment"
                                                                                                                                                                                                                                                            // }, {
                                                                                                                                                                                                                                                            //     id: "y-axis-onprogress"
                                                                                                                                                                                                                                                            // }, {
                                                                                                                                                                                                                                                            //     id: "y-axis-resolved"
                                                                                                                                                                                                                                                            // }, {
                                                                                                                                                                                                                                                            //     id: "y-axis-closed"
                                                                                                                                                                                                                                                        }]
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                if(window.bar !== undefined)
                                                                                                                                                                                                                                                window.bar = new Chart(canvas2017, {
                                                                                                                                                                                                                                                    type: 'bar',
                                                                                                                                                                                                                                                    data: monthData,
                                                                                                                                                                                                                                                    options: chartOptions
                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                //---------------------------------------------------- END BARU -------------------------------------

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
                                                                                                                                                                                                    })//start closed
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
                                                                                                                                                    })//start resolved
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
                                                                                                    })//start onprogress
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
                                                    })//start assignment
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
    })//start open

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
                                                //---------------------------------------------------- BARU -------------------------------------

                                                var canvas2017 = document.getElementById("monthChart");

                                                Chart.defaults.global.defaultFontFamily = "Lato";
                                                Chart.defaults.global.defaultFontSize = 18;

                                                var openData = {
                                                    label: 'Open',
                                                    data: [10, 12, 6, 9, 13, 11, 2, 3],
                                                    backgroundColor: 'rgba(219, 219, 219, 1)',
                                                    borderWidth: 0
                                                };

                                                var assignmentData = {
                                                    label: 'Assignment',
                                                    data: [10, 12, 6, 9, 13, 11, 2, 3],
                                                    backgroundColor: 'rgba(60, 141, 188, 1)',
                                                    borderWidth: 0
                                                };

                                                var onprogressData = {
                                                    label: 'On Progress',
                                                    data: [2, 12, 6, 9, 2, 11, 2, 3],
                                                    backgroundColor: 'rgba(243, 156, 18, 1)',
                                                    borderWidth: 0
                                                };

                                                var resolvedData = {
                                                    label: 'Resolved',
                                                    data: [10, 1, 6, 9, 8, 11, 2, 10],
                                                    backgroundColor: 'rgba(0, 166, 90, 1)',
                                                    borderWidth: 0
                                                };

                                                var closedData = {
                                                    label: 'Closed',
                                                    data: [9, 12, 6, 9, 13, 9, 2, 3],
                                                    backgroundColor: 'rgba(215, 57, 37, 1)',
                                                    borderWidth: 0
                                                };



                                                var monthData = {
                                                    labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                                                    datasets: [openData, assignmentData,onprogressData,resolvedData,closedData]
                                                };

                                                var chartOptions = {
                                                    scales: {
                                                        xAxes: [{

                                                        }],
                                                        yAxes: [{
                                                            //     id: "y-axis-open"
                                                            // }, {
                                                            //     id: "y-axis-assignment"
                                                            // }, {
                                                            //     id: "y-axis-onprogress"
                                                            // }, {
                                                            //     id: "y-axis-resolved"
                                                            // }, {
                                                            //     id: "y-axis-closed"
                                                        }]
                                                    }
                                                };

                                                var barChart = new Chart(canvas2017, {
                                                    type: 'bar',
                                                    data: monthData,
                                                    options: chartOptions
                                                });

                                                //---------------------------------------------------- END BARU -------------------------------------
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