(function (Bisnis) {
    Bisnis.Helpdesk.Ticket = {};

    var createAssignButton = function (ticketId, categoryId) {
        return '<button class="assign" data-ticket-id="' + ticketId + '" data-ticket-category-id="' + categoryId + '" type="button"><i class="fa fa-flag" data-toggle="tooltip" data-placement="bottom" title="ASSIGN TICKET" aria-hidden="true"></i></button>';
    };

    var createDetailButton = function (ticketId) {
        return '<button class="detail" data-ticket-id="' + ticketId + '" type="button"><i class="fa fa-inbox" data-toggle="tooltip" data-placement="bottom" title="DETAIL TIKET" aria-hidden="true"></i></button>';
    };

    var createCloseButton = function (ticketId) {
        return '<button class="closeTicket" data-ticket-id="' + ticketId + '" type="button"><i class="fa fa-times" data-toggle="tooltip" data-placement="bottom" title="TUTUP TIKET" aria-hidden="true"></i></button>';
    };

    var renderMe = function (idx, ticket, row, style) {
        row = row + '<tr class="' + ticket.id + '"'+ style +'>';
        row = row + '<td>' + (idx + 1) + '</td>';
        row = row + '<td>' + ticket.category.name +'</td>';
        row = row + '<td>' + ticket.title + '</td>';
        // row = row + '<td>' + ticket.status + '</td>';
        // row = row + '<td>' + ticket.priority + '</td>';
        if (ticket.status === 'open') {

            row = row + '<td align="center"><div class="fa fa-ticket fa-2x" data-toggle="tooltip" data-placement="bottom" title="Open" style="color: orange;"></div></td>'

        } else if (ticket.status === 'assignment') {

            row = row + '<td align="center"><div class="fa fa-tag fa-2x" data-toggle="tooltip" data-placement="bottom" title="Assignment" style="color: cornflowerblue;"></div></td>'

        } else if (ticket.status === 'closed') {

            row = row + '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: indianred"></div></td>';

        } else if (ticket.status === 'onprogress') {

            row = row + '<td align="center"><div class="fa fa-pencil fa-2x" data-toggle="tooltip" data-placement="bottom" title="On Progress" style="color: gold"></div></td>';

        } else if (ticket.status === 'resolved') {

            row = row + '<td align="center"><div class="fa fa-check fa-2x" data-toggle="tooltip" data-placement="bottom" title="Resolved" style="color: lawngreen"></div></td>';

        }

        if (ticket.priority === 'very_urgent') {

            row = row + '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: red;"></div></td>'

        } else if (ticket.priority === 'urgent') {

            row = row + '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: orangered;"></div></td>'

        } else if (ticket.priority === 'normal') {

            row = row + '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: orange"></div></td>';

        } else if (ticket.priority === 'low') {

            row = row + '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkorange"></div></td>';
        }

        // row = row + '<td>' + ticket.createdAt + '</td>';
        row = row + '<td>' + moment(ticket.createdAt).format('LLLL') + '</td>';
        row = row + '<td>';

        if ('closed' !== ticket.status && 'resolved' !== ticket.status) {
            if ('open' !== ticket.status) {
                row = row + createDetailButton(ticket.id);
            }

            row = row + createCloseButton(ticket.id) ;
        }

        row = row + '</td>';
        row = row + '</tr>';

        if(idx > 17) {
            row = row + '<ul data-paging="roles" class="pagination pagination-sm no-margin pull-right">';
            row = row + '<li>';
            row = row + '<span class="to-roles-page" data-page="1" title="FIRST PAGE">FIRST</span>';
            row = row + '</li>;'
            row = row + '<li>';
            row = row + '<span class="to-roles-page" data-page="3" title="LAST PAGE">LAST</span>';
            row = row + '</li>';
            row = row + '<li>';
            row = row + '<span class="to-roles-page" data-page="2" title="NEXT PAGE">NEXT</span>';
            row = row + '</li>';
            row = row + '</ul>';
        }

        return row;
    };


    var render = function (idx, ticket, row, style) {
        row = row + '<tr class="' + ticket.id + '"'+ style +'>';
        row = row + '<td>' + (idx + 1) + '</td>';

        if (null !== ticket.client) {
            row = row + '<td>' + ticket.client.fullname +'</td>';
        } else {
            row = row + '<td>&nbsp;</td>';
        }

        if (null !== ticket.staff) {
            row = row + '<td>' + ticket.staff.fullname +'</td>';
        } else {
            row = row + '<td>&nbsp;</td>';
        }

        row = row + '<td>' + ticket.category.name +'</td>';
        row = row + '<td>' + ticket.title + '</td>';
        // row = row + '<td>' + ticket.status + '</td>';
        // row = row + '<td>' + ticket.priority + '</td>';
        if (ticket.status === 'open') {

            row = row + '<td align="center"><div class="fa fa-ticket fa-2x" data-toggle="tooltip" data-placement="bottom" title="Open" style="color: orange;"></div></td>'

        } else if (ticket.status === 'assignment') {

            row = row + '<td align="center"><div class="fa fa-tag fa-2x" data-toggle="tooltip" data-placement="bottom" title="Assignment" style="color: cornflowerblue;"></div></td>'

        } else if (ticket.status === 'closed') {

            row = row + '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: indianred"></div></td>';

        } else if (ticket.status === 'onprogress') {

            row = row + '<td align="center"><div class="fa fa-pencil fa-2x" data-toggle="tooltip" data-placement="bottom" title="On Progress" style="color: gold"></div></td>';

        } else if (ticket.status === 'resolved') {

            row = row + '<td align="center"><div class="fa fa-check fa-2x" data-toggle="tooltip" data-placement="bottom" title="Resolved" style="color: lawngreen"></div></td>';

        }

        if (ticket.priority === 'very_urgent') {

            row = row + '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: red;"></div></td>'

        } else if (ticket.priority === 'urgent') {

            row = row + '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: orangered;"></div></td>'

        } else if (ticket.priority === 'normal') {

            row = row + '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: orange"></div></td>';

        } else if (ticket.priority === 'low') {

            row = row + '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkorange"></div></td>';
        }
        row = row + '<td>' + moment(ticket.createdAt).format('LLLL') + '</td>';
        row = row + '<td>';

        if ('open' === ticket.status || 'assignment' === ticket.status) {
            row = row + createAssignButton(ticket.id, ticket.category.id);
        }

        if ('closed' !== ticket.status && 'resolved' !== ticket.status) {
            if ('open' !== ticket.status) {
                row = row + createDetailButton(ticket.id);
            }

            row = row + createCloseButton(ticket.id) ;
        }

        row = row + '</td>';
        row = row + '</tr>';

        return row;
    };

    Bisnis.Helpdesk.Ticket.fetchClosed = function (params, renderTo, useMe) {
        params = Object.assign(params, {
            status: ['resolved', 'closed']
        });

        Bisnis.request({
            module: 'helpdesk/tickets',
            method: 'get',
            params: [params]
        }, function (response) {
            var rawData = JSON.parse(response);
            var ticketList = rawData['hydra:member'];

            Bisnis.Helpdesk.Ticket.render(ticketList, renderTo, useMe);
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.fetchClosable = function (params, renderTo, useMe) {
        params = Object.assign(params, {
            status: ['open', 'assignment', 'onprogress']
        });

        Bisnis.request({
            module: 'helpdesk/tickets',
            method: 'get',
            params: [params]
        }, function (response) {
            var rawData = JSON.parse(response);
            var ticketList = rawData['hydra:member'];

            Bisnis.Helpdesk.Ticket.render(ticketList, renderTo, useMe);

            Bisnis.each(function (index, ticket) {
                Bisnis.Helpdesk.Ticket.hasUnreadResponse(ticket.id, function (response) {
                    if (0 < response.length) {
                        Bisnis.Util.Style.bold('.' + ticket.id);
                    }
                });
            }, ticketList);
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.fetch = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/tickets/' + ticketId,
            method: 'get',
            params: []
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(JSON.parse(response));
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.hasUnreadResponse = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses',
            method: 'get',
            params: [{'ticket.id': ticketId, 'read': false}]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                var rawData = JSON.parse(response);
                callback(rawData['hydra:member']);
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.markReadClientResponseByTicket = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses/' + ticketId + '/read-client.json',
            method: 'put',
            params: []
        }, function () {
            if (Bisnis.validCallback(callback)) {
                console.log('Marking read all client response with ticket id ' + ticketId);
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.markReadStaffResponseByTicket = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses/' + ticketId + '/read-staff.json',
            method: 'put',
            params: []
        }, function () {
            if (Bisnis.validCallback(callback)) {
                console.log('Marking read all staff response with ticket id ' + ticketId);
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.fetchReponse = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses',
            method: 'get',
            params: [{'ticket.id': ticketId, 'order[createdAt]': 'DESC'}]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                var rawData = JSON.parse(response);
                callback(rawData['hydra:member']);
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.sendReponse = function (params, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses',
            method: 'post',
            params: params
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(JSON.parse(response));
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.createNew = function (clientId, categoryId, title, message, callback) {
        Bisnis.request({
            module: 'helpdesk/tickets',
            method: 'post',
            params: [
                {
                    name: 'client',
                    value: clientId
                },
                {
                    name: 'category',
                    value: categoryId
                },
                {
                    name: 'title',
                    value: title
                },
                {
                    name: 'message',
                    value: message
                }
            ]
        }, function () {
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.update = function (ticketId, params, callback) {
        Bisnis.request({
            module: 'helpdesk/tickets/' + ticketId,
            method: 'put',
            params: params
        }, function () {
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.render = function (ticketList, selector, useRenderMe) {
        useRenderMe = 'undefined' === typeof useRenderMe ? false : useRenderMe;

        var row = '';
        Bisnis.each(function (idx, ticket) {
            var bold = ' style="font-weight:bold;"';
            if (true === ticket.read) {
                bold = '';
            }

            if (true === useRenderMe) {
                row = renderMe(idx, ticket, row, bold);
            } else {
                row = render(idx, ticket, row, bold);
            }
        }, ticketList);

        if ('' === row) {
            Bisnis.putHtml(selector, '<p style="font-weight: bold; padding-left: 17px; font-size: 17px;">Belum ada data</p>');
        } else {
            Bisnis.putHtml(selector, row);
        }
    };

    Bisnis.Helpdesk.Ticket.fetchByClient = function (clientId) {
        Bisnis.Helpdesk.Ticket.fetchClosable({'client.id' : clientId}, '#assignedToMe', true);
    };

    Bisnis.Helpdesk.Ticket.fetchByStaff = function (staffId) {
        Bisnis.Helpdesk.Ticket.fetchClosable({'staff.id' : staffId}, '#assignedToMe');
    };

    Bisnis.Helpdesk.Ticket.markRead = function (ticketId, callback) {
        Bisnis.Helpdesk.Ticket.update(ticketId, [{name: 'read', value: true}], function () {
            console.log('Marking read ticket with id ' + ticketId);
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        });
    };

    Bisnis.Helpdesk.Ticket.close = function (ticketId) {
        Bisnis.Helpdesk.Ticket.update(ticketId, [{name: 'status', value: 'closed'}], function () {
            console.log('Closing ticket with id ' + ticketId);
        });
    };

    Bisnis.Helpdesk.Ticket.assignTo = function (ticketId, staffUri, callback) {
        Bisnis.Helpdesk.Ticket.update(ticketId, [
            {name: 'staff', value: staffUri},
            {name: 'status', value: 'assignment'}
        ], callback);
    };

    Bisnis.Helpdesk.Ticket.buildChat = function (profileImage, sender, message, date, appendTo) {
        appendTo = 'undefined' === typeof appendTo ? '' : appendTo;

        return appendTo + '<div class="media"><div class="media-left"><img src="' + profileImage + '" class="media-object" style="width:60px"></div>'
            + '<div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>' + date + '</h6>'
            + '<h4 class="media-heading">' + sender + '</h4>'
            + '<p>' + message + '</p></div></div><hr>'
        ;
    };

    Bisnis.Helpdesk.Ticket.viewByTicket = function (ticketId) {
        Bisnis.Helpdesk.Ticket.fetch(ticketId, function (ticket) {
            Bisnis.putHtml('.chatTicketClient', ticket.client.fullname);
            Bisnis.putHtml('.chatTicketCategory', ticket.category.name);
            Bisnis.putHtml('.chatTicketTitle', ticket.title);
            Bisnis.putHtml('.chatTicketDate', moment(ticket.createdAt).format('LLLL'));

            var profileImage = ticket.client.profileImage.split('.');

            var chat = Bisnis.Helpdesk.Ticket.buildChat(
                '/api/images/' + profileImage[0] + '?ext=' + profileImage[1],
                ticket.client.fullname,
                ticket.message,
                moment(ticket.createdAt).format('LLLL')
            );

            Bisnis.Helpdesk.Ticket.fetchReponse(ticket.id, function (ticketResponse) {
                Bisnis.each(function (index, value) {
                    var profileImage = ['a', 'b'];
                    var sender = 'Anonim';
                    if (null !== value.client) {
                        profileImage = value.client.profileImage.split('.');
                        sender = value.client.fullname;
                    } else if (null !== value.staff)  {
                        profileImage = value.staff.user.profileImage.split('.');
                        sender = value.staff.user.fullname;
                    }

                    chat = Bisnis.Helpdesk.Ticket.buildChat(
                        '/api/images/' + profileImage[0] + '?ext=' + profileImage[1],
                        sender,
                        value.message,
                        moment(value.createdAt).format('LLLL'),
                        chat
                    );
                }, ticketResponse);

                Bisnis.putHtml('#chatHistory', chat);
            });
        });
    };
})(window.Bisnis || {});