(function (Bisnis) {
    Bisnis.User = {};
    
    Bisnis.User.getRoles = function (userId, pageNumber) {
        var moduleData = {
            module: 'modules',
            method: 'get',
            params: [{'page': pageNum}]
        };

        var roleData = {
            module: 'roles',
            method: 'get',
            params: [{'user.id': userId}]
        };

        var ajaxModules = Bisnis.request('POST', moduleData);
        var ajaxRoles = Bisnis.request('POST', roleData);

        jQuery.when(ajaxModules, ajaxRoles).done(function(responseModules, responseRoles) {
            if(('success' === responseModules[1] && 'success' === responseRoles[1])) {
                var dataRoles = JSON.parse(responseRoles[0]);
                var roles = [];
                Bisnis.each(function (idx, val) {
                    roles[val.module.id] = {
                        roleId: val.id,
                        moduleName: val.module.name,
                        module: val.module.id,
                        viewable: val.viewable,
                        addable: val.addable,
                        editable: val.editable,
                        deletable: val.deletable
                    };
                }, dataRoles['hydra:member']);

                var userRoles = [];
                var dataModules = JSON.parse(responseModules[0]);
                Bisnis.each(function (idx, val) {
                    if ('undefined' !== typeof roles[val.id]) {
                        userRoles[idx] = {
                            moduleName: roles[val.id].moduleName,
                            module: roles[val.id].module,
                            viewable: roles[val.id].viewable,
                            addable: roles[val.id].addable,
                            editable: roles[val.id].editable,
                            deletable: roles[val.id].deletable,
                            roleId: roles[val.id].roleId
                        };
                    } else {
                        userRoles[idx] = {
                            moduleName: val.name,
                            module: val.id,
                            viewable: false,
                            addable: false,
                            editable: false,
                            deletable: false,
                            roleId: null
                        };
                    }
                }, dataModules['hydra:member']);

                var paging = '';
                Bisnis.each(function (index, value) {
                    if(index.endsWith('previous')) {
                        page = getQueryVariable('page',value);
                        paging += '<li><span class="to-roles-page" data-page="'+page+'" title="PREVIOUS PAGE">PREVIOUS</span></li>';
                    }

                    if(index.endsWith('first')) {
                        page = getQueryVariable('page',value);
                        paging += '<li><span class="to-roles-page" data-page="'+page+'" title="FIRST PAGE">FIRST</span></li>';
                    }

                    if(index.endsWith('next')) {
                        page = getQueryVariable('page',value);
                        paging += '<li><span class="to-roles-page" data-page="'+page+'" title="NEXT PAGE">NEXT</span></li>';
                    }

                    if(index.endsWith('last')) {
                        page = getQueryVariable('page',value);
                        paging += '<li><span class="to-roles-page" data-page="'+page+'" title="LAST PAGE">LAST</span></li>';
                    }
                }, dataRoles['hydra:view']);

                jQuery('ul[data-paging="roles"].pagination').empty().html(paging);
                
                rolesResponse(userRoles, userId, pageNum);
            }
        });
    };
})(window.Bisnis || {});