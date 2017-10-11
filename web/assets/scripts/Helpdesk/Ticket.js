(function (Bisnis) {
    Bisnis.Helpdesk.Ticket = {};

    var createAssignButton = function (ticketId, categoryId) {
        return '<button class="assign btn btn-xs btn-primary fa fa-user-plus" style="margin-right: 5px;" title="Assign" data-ticket-id="' + ticketId + '" data-ticket-category-id="' + categoryId + '" type="button"></button>';
    };

    var createDetailButton = function (ticketId) {
        return '<button class="detail btn btn-xs btn-warning fa fa-eye" style="margin-right: 5px;" title="Detail" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createChangePriorityButton = function (ticketId) {
        return '<button class="changePriorityTicket btn btn-xs btn-info fa fa-pencil" style="margin-right: 5px;" title="Change priority" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createCloseButton = function (ticketId) {
        return '<button class="closeTicket btn btn-xs btn-danger fa fa-times" title="Close" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createReopenButton = function (ticketId) {
        return '<button class="reopenTicket btn btn-xs btn-success fa fa-folder-open" title="Close" data-ticket-id="' + ticketId + '" type="button"></button>';
    };

    var createStatusButton = function (status) {
        var statusText;
        var statusColor;
        switch (status) {
            case 'open':
                statusText = 'OPEN';
                statusColor = 'default';
                break;
            case 'assignment':
                statusText = 'ASSIGNMENT';
                statusColor = 'primary';
                break;
            case 'onprogress':
                statusText = 'ON PROGRESS';
                statusColor = 'warning';
                break;
            case 'resolved':
                statusText = 'RESOLVED';
                statusColor = 'success';
                break;
            default:
                statusText = 'NOT DEFINED';
                statusColor = 'default';
                break;
        }

        return '<span class="label label-' + statusColor + '" title="' + statusText + '">' + statusText + '</span>';
    };

    var createPriorityButton = function (priority) {
        var priorityMark = 'default';
        var priorityText = 'LOW';
        switch (priority) {
            case 'low':
                priorityMark = 'default';
                priorityText = 'LOW';
                break;
            case 'normal':
                priorityMark = 'primary';
                priorityText = 'NORMAL';
                break;
            case 'urgent':
                priorityMark = 'warning';
                priorityText = 'URGENT';
                break;
        }

        return '<label class="label label-'+ priorityMark +'" title="' + priority + '">'+priorityText+'</label>';
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
        } else {
            row = row + createDetailButton(ticket.id);
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
        } else {
            row = row + '<span></span>';
        }

        if ('closed' !== ticket.status && 'resolved' !== ticket.status) {
            if ('open' !== ticket.status) {
                row = row + createDetailButton(ticket.id);
            }

            row = row + createChangePriorityButton(ticket.id);
            row = row + createCloseButton(ticket.id) ;
        } else {
            if ('undefined' !== typeof ticket.staff) {
                row = row + createDetailButton(ticket.id);
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
            if (true === ticket.read || 'closed' === ticket.status || 'resolved' === ticket.status) {
                bold = '';
            }

            if (true === useRenderMe) {
                row = renderMe(idx, ticket, row, bold);
            } else {
                row = render(idx, ticket, row, bold);
            }
        }, ticketList);

        if ('' === row) {
            Bisnis.Util.Document.putHtml(selector, '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
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
            Bisnis.Util.Dialog.alert('Gagal memperbarui tiket');
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
            var ticketList = response['hydra:member'];
            var viewData = response['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('TICKET_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination(paginationSelector, Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            renderGrid(ticketList, renderTo, useMe);
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data tiket');
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
            var ticketList = response['hydra:member'];
            var viewData = response['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('TICKET_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination(paginationSelector, Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            renderGrid(ticketList, renderTo, useMe);

            Bisnis.each(function (index, ticket) {
                if ('closed' === ticket.status || 'resolved' === ticket.status) {
                    return;
                }

                Bisnis.Helpdesk.Ticket.hasUnreadResponse(ticket.id, params, function (response) {
                    if (0 < response.length) {
                        Bisnis.Util.Style.bold('.' + ticket.id);
                    }
                });
            }, ticketList);
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data tiket');
        });
    };

    Bisnis.Helpdesk.Ticket.fetch = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/tickets/' + ticketId,
            method: 'get',
            params: []
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(response);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data tiket');
        });
    };

    Bisnis.Helpdesk.Ticket.hasUnreadResponse = function (ticketId, filter, callback) {
        var params = {
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
                callback(response['hydra:member']);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data tiket');
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
            Bisnis.Util.Dialog.alert('Gagal memperbarui data respon tiket');
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
            Bisnis.Util.Dialog.alert('Gagal memperbarui data respon tiket');
        });
    };

    Bisnis.Helpdesk.Ticket.fetchReponse = function (ticketId, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses',
            method: 'get',
            params: [{'ticket.id': ticketId, 'order[createdAt]': 'DESC'}]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(response['hydra:member']);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data respon tiket');
        });
    };

    Bisnis.Helpdesk.Ticket.sendReponse = function (params, callback) {
        Bisnis.request({
            module: 'helpdesk/ticket-responses',
            method: 'post',
            params: params
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(response);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengirim data respon tiket');
        });
    };

    Bisnis.Helpdesk.Ticket.createNew = function (clientId, categoryId, ticketType, title, message, callback) {
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
                    name: 'ticketType',
                    value: ticketType
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
            Bisnis.WebSocket.ping();
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengirim data tiket');
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

        return appendTo + '<div class="media"><div class="media-left"><img class="img-circle" src="' + profileImage + '" style="width:77px;"></div>'
            + '<div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>&nbsp;' + date + '</h6>'
            + '<h4 class="media-heading"><b>' + sender + '</b></h4>'
            + '<blockquote>' + message + '</blockquote></div></div>'
        ;
    };

    Bisnis.Helpdesk.Ticket.viewByTicket = function (ticketId) {
        var responses = [];
        var chat = '';
        Bisnis.Helpdesk.Ticket.fetch(ticketId, function (ticket) {
            Bisnis.Util.Document.putHtml('.chatTicketClient', ticket.client.fullname);
            if (null !== ticket.staff) {
                Bisnis.Util.Document.putHtml('.chatTicketStaff', ticket.staff.user.fullname);
            }

            Bisnis.Util.Document.putHtml('.chatTicketCategory', ticket.category.name);
            Bisnis.Util.Document.putHtml('.chatTicketType', ticket.type);
            Bisnis.Util.Document.putHtml('.chatTicketTitle', ticket.title);
            Bisnis.Util.Document.putHtml('.chatTicketDate', moment(ticket.createdAt).format('DD-MM-YYYY hh:mm:ss'));
            Bisnis.Util.Document.putHtml('.chatTicketStatus', createStatusButton(ticket.status));

            var profileImage = ticket.client.profileImage.split('.');
            responses.push({
                image: '/api/images/' + profileImage[0] + '?ext=' + profileImage[1],
                name: ticket.client.fullname,
                message: ticket.message,
                createdAt: ticket.createdAt
            });

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

                    responses.push({
                        image: '/api/images/' + profileImage[0] + '?ext=' + profileImage[1],
                        name: sender,
                        message: value.message,
                        createdAt: value.createdAt
                    });
                }, ticketResponse);

                responses.sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                Bisnis.each(function (idx, value) {
                    chat = Bisnis.Helpdesk.Ticket.buildChat(
                        value.image,
                        value.name,
                        value.message,
                        moment(value.createdAt).format('DD-MM-YYYY hh:mm:ss'),
                        chat
                    );
                }, responses);

                Bisnis.Util.Document.putHtml('#chatHistory', chat);
            });
        });
    };

    Bisnis.Helpdesk.Ticket.fetchStatisticByCategory = function (params, callback) {
        Bisnis.request({
            module: 'helpdesk/tickets/category.json',
            method: 'get',
            params: [params]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                var statistics = {
                    'assignment': [],
                    'closed': [],
                    'onprogress': [],
                    'open': [],
                    'resolved': []
                };

                Bisnis.each(function (idx, value) {
                    var index = idx - 1;

                    statistics['assignment'][index] = 0;
                    statistics['closed'][index] = 0;
                    statistics['onprogress'][index] = 0;
                    statistics['open'][index] = 0;
                    statistics['resolved'][index] = 0;

                    if (0 < value.length) {
                        Bisnis.each(function (i, stat) {
                            statistics[stat['status']][index] = parseInt(stat['total']);
                        }, value);
                    }
                }, response);

                callback(statistics);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data kategori tiket');
        });
    };

    Bisnis.Helpdesk.Ticket.fetchStatisticPerStaff = function (params, callback) {
        Bisnis.request({
            module: 'helpdesk/tickets/staff.json',
            method: 'get',
            params: [params]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                Bisnis.Util.Storage.store('__HELPDESK_CHARTDATA_DETAIL__', JSON.stringify(response));
                callback();
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data staff');
        });
    };

    Bisnis.Helpdesk.Ticket.fetchStatistic = function (callback) {
        Bisnis.request({
            module: 'helpdesk/tickets/statistic.json',
            method: 'get'
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(response);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('Gagal mengambil data statistik tiket');
        });
    };
})(window.Bisnis || {});