(function (Bisnis) {
    Bisnis.Helpdesk.Ticket = {};

    var createAssignButton = function (ticketId, categoryId) {
        return '<button class="assign btn btn-primary fa fa-reply" style="margin-right: 5px;" title="Assign" data-ticket-id="' + ticketId + '" data-ticket-category-id="' + categoryId + '" type="button"></button>';
    };

    var createDetailButton = function (ticketId) {
        return '<button class="detail btn btn-warning fa fa-wifi" style="margin-right: 5px;" title="Detail" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createChangePriorityButton = function (ticketId) {
        return '<button class="changePriorityTicket btn btn-info fa fa-rocket" style="margin-right: 5px;" title="Change priority" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createCloseButton = function (ticketId) {
        return '<button class="closeTicket btn btn-danger fa fa-thumbs-down" title="Close" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createReopenButton = function (ticketId) {
        return '<button class="reopenTicket btn btn-success fa fa-recycle" title="Close" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createStatusButton = function (status) {
        var statusIcon = 'fa-battery-';
        var statusButton = 'default';
        switch (status) {
            case 'open':
                statusIcon = statusIcon + '0';
                break;
            case 'assignment':
                statusIcon = statusIcon + '2';
                statusButton = 'primary';
                break;
            case 'onprogress':
                statusIcon = statusIcon + '3';
                statusButton = 'warning';
                break;
            case 'resolved':
                statusIcon = statusIcon + '4';
                statusButton = 'success';
                break;
            default:
                statusIcon = statusIcon + '4';
                statusButton = 'danger';
                break;
        }

        return '<button class="btn btn-' + statusButton + '" style="width: 100%;" title="' + status + '"><i class="fa ' + statusIcon + '"></i></button>';
    };

    var createPriorityButton = function (priority) {
        var priorityMark = 'danger';
        switch (priority) {
            case 'low':
                priorityMark = 'default';
                break;
            case 'normal':
                priorityMark = 'primary';
                break;
            case 'urgent':
                priorityMark = 'warning';
                break;
        }

        return '<button class="btn btn-'+ priorityMark +'" style="width: 100%;" title="' + priority + '"><i class="fa fa-ambulance"></i></button>';
    };

    var renderMe = function (idx, ticket, row, style) {
        row = row + '<tr class="' + ticket.id + '"'+ style +'>';
        row = row + '<td>' + (idx + 1) + '</td>';
        row = row + '<td>' + ticket.category.name +'</td>';
        row = row + '<td>' + ticket.title + '</td>';
        row = row + '<td>' + createStatusButton(ticket.status) +'</td>';
        row = row + '<td>' + createPriorityButton(ticket.priority) + '</td>';
        row = row + '<td>' + moment(ticket.createdAt).format('DD-MM-YYYY hh:mm:ss') + '</td>';
        row = row + '<td>';

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
        row = row + '<td>' + createStatusButton(ticket.status) +'</td>';
        row = row + '<td>' + createPriorityButton(ticket.priority) + '</td>';;
        row = row + '<td>' + moment(ticket.createdAt).format('DD-MM-YYYY hh:mm:ss') + '</td>';
        row = row + '<td>';

        if ('open' === ticket.status || 'assignment' === ticket.status) {
            row = row + createAssignButton(ticket.id, ticket.category.id);
        }

        if ('closed' !== ticket.status && 'resolved' !== ticket.status) {
            if ('open' !== ticket.status) {
                row = row + createDetailButton(ticket.id);
            }

            row = row + createChangePriorityButton(ticket.id);
            row = row + createCloseButton(ticket.id) ;
        } else {
            if ('undefined' !== typeof ticket.staff) {
                row = row + createReopenButton(ticket.id);
            }
        }

        row = row + '</td>';
        row = row + '</tr>';

        return row;
    };

    var renderGrid = function (ticketList, selector, useRenderMe) {
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
            Bisnis.Util.Document.putHtml(selector, '<p style="font-weight: bold; padding-left: 17px; font-size: 11px;">Belum ada data</p>');
        } else {
            Bisnis.Util.Document.putHtml(selector, row);
        }
    };

    var updateTicket = function (ticketId, params, callback) {
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

    Bisnis.Helpdesk.Ticket.fetchClosed = function (params, renderTo, useMe, paginationSelector) {
        paginationSelector = 'undefined' === typeof paginationSelector ? '.pagination' : paginationSelector;

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
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('TICKET_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination(paginationSelector, Bisnis.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            renderGrid(ticketList, renderTo, useMe);
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Ticket.fetchClosable = function (params, renderTo, useMe, paginationSelector) {
        paginationSelector = 'undefined' === typeof paginationSelector ? '.pagination' : paginationSelector;

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
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('TICKET_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination(paginationSelector, Bisnis.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            renderGrid(ticketList, renderTo, useMe);

            Bisnis.each(function (index, ticket) {
                Bisnis.Helpdesk.Ticket.hasUnreadResponse(ticket.id, params, function (response) {
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

    Bisnis.Helpdesk.Ticket.hasUnreadResponse = function (ticketId, filter, callback) {
        params = {
            'ticket.id': ticketId,
            'read': false
        };

        if ('undefined' !== typeof filter) {
            params = Object.assign(params, filter);
        }

        Bisnis.request({
            module: 'helpdesk/ticket-responses',
            method: 'get',
            params: [params]
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

    Bisnis.Helpdesk.Ticket.fetchByClient = function (clientId, page, paginationSelector) {
        page = 'undefined' === typeof page ?  1 : parseInt(page);
        Bisnis.Helpdesk.Ticket.fetchClosable({'client.id' : clientId, 'page': page}, '#assignedToMe', true, paginationSelector);
    };

    Bisnis.Helpdesk.Ticket.fetchByStaff = function (staffId, page, paginationSelector) {
        page = 'undefined' === typeof page ?  1 : parseInt(page);
        Bisnis.Helpdesk.Ticket.fetchClosable({'staff.id' : staffId, 'page': page}, '#assignedToMe', false, paginationSelector);
    };

    Bisnis.Helpdesk.Ticket.markRead = function (ticketId, callback) {
        updateTicket(ticketId, [{name: 'read', value: true}], function () {
            console.log('Marking read ticket with id ' + ticketId);
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        });
    };

    Bisnis.Helpdesk.Ticket.close = function (ticketId) {
        updateTicket(ticketId, [{name: 'status', value: 'closed'}], function () {
            console.log('Closing ticket with id ' + ticketId);
        });
    };

    Bisnis.Helpdesk.Ticket.resolve = function (ticketId) {
        updateTicket(ticketId, [{name: 'status', value: 'resolved'}], function () {
            console.log('Resolving ticket with id ' + ticketId);
        });
    };

    Bisnis.Helpdesk.Ticket.markOnProgress = function (ticketId) {
        updateTicket(ticketId, [{name: 'status', value: 'onprogress'}], function () {
            console.log('Mark on progress ticket with id ' + ticketId);
        });
    };

    Bisnis.Helpdesk.Ticket.changePriority = function (ticketId, priority) {
        updateTicket(ticketId, [{name: 'priority', value: priority}], function () {
            console.log('Changing priority ticket with id ' + ticketId);
        });
    };

    Bisnis.Helpdesk.Ticket.assignTo = function (ticketId, staffUri, callback) {
        updateTicket(ticketId, [
            {name: 'staff', value: staffUri},
            {name: 'status', value: 'assignment'}
        ], callback);
    };

    Bisnis.Helpdesk.Ticket.buildChat = function (profileImage, sender, message, date, appendTo) {
        appendTo = 'undefined' === typeof appendTo ? '' : appendTo;

        return appendTo + '<div class="media"><div class="media-left"><img src="' + profileImage + '" class="media-object" style="width:60px"></div>'
            + '<div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>&nbsp;' + date + '</h6>'
            + '<h4 class="media-heading">' + sender + '</h4>'
            + '<p>' + message + '</p></div></div><hr>'
        ;
    };

    Bisnis.Helpdesk.Ticket.viewByTicket = function (ticketId) {
        Bisnis.Helpdesk.Ticket.fetch(ticketId, function (ticket) {
            Bisnis.Util.Document.putHtml('.chatTicketClient', ticket.client.fullname);
            Bisnis.Util.Document.putHtml('.chatTicketStaff', ticket.staff.user.fullname);
            Bisnis.Util.Document.putHtml('.chatTicketCategory', ticket.category.name);
            Bisnis.Util.Document.putHtml('.chatTicketTitle', ticket.title);
            Bisnis.Util.Document.putHtml('.chatTicketDate', moment(ticket.createdAt).format('DD-MM-YYYY hh:mm:ss'));

            var profileImage = ticket.client.profileImage.split('.');

            var chat = Bisnis.Helpdesk.Ticket.buildChat(
                '/api/images/' + profileImage[0] + '?ext=' + profileImage[1],
                ticket.client.fullname,
                ticket.message,
                moment(ticket.createdAt).format('DD-MM-YYYY hh:mm:ss')
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
                        moment(value.createdAt).format('DD-MM-YYYY hh:mm:ss'),
                        chat
                    );
                }, ticketResponse);

                Bisnis.Util.Document.putHtml('#chatHistory', chat);
            });
        });
    };

})(window.Bisnis || {});