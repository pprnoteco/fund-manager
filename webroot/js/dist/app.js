/*
 |------------------------------------------------------------------------
 | App.js
 |------------------------------------------------------------------------
 */

(function(root, Backbone){
    
    function Application () {
        
    }
    
    Application.prototype.urlRoot = undefined;
    
    Application.prototype.url = function (path) {
        if (!path) {
            return this.urlRoot;
        }
        return this.urlRoot + path;
    }
    
    var App = new Application();
    
    App.formats = {
        currency: function (value) {
            if (!value || !_.isNumber(value)) return '$ -';
            value = value.toFixed(2).toString();
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            return '$ ' + value;
        }
    }
    
    root.App = App;
    
}(window, Backbone));

/*
 |------------------------------------------------------------------------
 | App: Model
 |------------------------------------------------------------------------
 */

(function(App, Backbone){
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Model = Backbone.Model.extend({
        
        urlRoot: undefined,
        serverNode: undefined,
        
        /*
         |----------------------------------------------------------------
         | Url
         |----------------------------------------------------------------
         */
        
        url: function (path, query) {
            path = path ? this.urlRoot + '/' + path : this.urlRoot;
            return App.url(path, query);
        },
        
        /*
         |----------------------------------------------------------------
         | Format
         |----------------------------------------------------------------
         */
        
        format: function (attribute) {
            var value = this.get(attribute);
            var formatter = this.formats[attribute];
            if (formatter) {
                value = formatter(value, this);
            }
            return value;
        },
        
        /*
         |----------------------------------------------------------------
         | Format
         |----------------------------------------------------------------
         */
        
        formats: {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Prepare
         |----------------------------------------------------------------
         */
        
        prepare: function () {
            return this.attributes;
        },
        
    });
    
    App.Model = Model;
    
}(App, Backbone));

/*
 |------------------------------------------------------------------------
 | App: Collection
 |------------------------------------------------------------------------
 */

(function(App, Backbone, _){
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Collection = Backbone.Collection.extend({
        
        model: App.Model,
        
        /*
         |----------------------------------------------------------------
         | Order
         |----------------------------------------------------------------
         */
        
        order: function (attribute, order) {
            console.log(attribute, order);
            var collection = this.clone();
            if (!attribute) return collection;
            order || (order = 'asc');
            collection.comparator = attribute;
            collection.sort();
            if (order !== 'asc') {
                collection.models.reverse();
            }
            return collection;
        },
        
        /*
         |----------------------------------------------------------------
         | Limit
         |----------------------------------------------------------------
         */
        
        limit: function (limit, page) {
            var length = this.length;
            page || (page = 1);
            if (!limit || !length || limit > length) {
                return this.models;
            }
            var start = limit * (page - 1);
            var end = start + limit;
            return this.slice(start, end);
        },
        
        /*
         |----------------------------------------------------------------
         | Matcher
         |----------------------------------------------------------------
         */
        
        matcher: function (needle, haystack) {
            if (!needle || !haystack) return;
            needle = needle.toString().toLowerCase();
            haystack = haystack.toString().toLowerCase();
            return haystack.indexOf( needle ) >= 0;
        },
        
        /*
         |----------------------------------------------------------------
         | Search
         |----------------------------------------------------------------
         */
        
        search: function (keyword, attributes) {
            var collection = this.clone();
            if (!collection.length || !keyword) return collection;
            
            var matcher = this.matcher;
            collection.reset(collection.filter(function (model) {
                if (!attributes || !attributes.length) {
                    attributes = _.keys(model.attributes);
                }
                return !_.every(attributes, function(attribute){
                    return !matcher(keyword, model.get(attribute));
                });
            }));
            
            return collection;
        },
        
        /*
         |----------------------------------------------------------------
         | toCsv
         |----------------------------------------------------------------
         */
        
        toCsv: function () {
            var header;
            this.each(function (model) {
                if (!header) {
                    header = [];
                    _.each(model.keys())
                }
                row = [];
                _.each(attrs, function (attr) {
                    row.push(model.get(attr));
                });
                rows.push(_.formatCsvRow(row));
            });
            return rows.join('\n');
        },
        
    });
    
    App.Collection = Collection;
    
}(App, Backbone, _));

/*
 |------------------------------------------------------------------------
 | App: View
 |------------------------------------------------------------------------
 */

(function(App, Backbone){
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var View = Backbone.View.extend({
        
        alert: undefined,
        alertElement: undefined,
        _loading: false,
        
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        constructor: function (options) {
            Backbone.View.call(this, options);
            if (options.alertElement) {
                this.alertElement = options.alertElement;
            }
            this.initAlert();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize alert
         |----------------------------------------------------------------
         */
        
        initAlert: function () {
            var Alert = App.Alert;
            var alert = new Alert({
                el: document.getElementById(this.alertElement)
            });
            this.alert = alert;
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            
        },
    
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            
        },
    
        /*
         |----------------------------------------------------------------
         | Is loading
         |----------------------------------------------------------------
         */
        
        isLoading: function () {
            return !!this._loading;
        },
    
        /*
         |----------------------------------------------------------------
         | Loading (setter)
         |----------------------------------------------------------------
         */
        
        loading: function (state) {
            var prev = this._loading;
            this._loading = !!state;
            if (this._loading) {
                this.loadingStateOn();
            } else {
                this.loadingStateOff();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
    
        reset: function (model) {
            this.model = model;
            this.render();
        },
        
    });
    
    App.View = View;
    
}(App, Backbone));

/*
 |------------------------------------------------------------------------
 | App: Mixins
 |------------------------------------------------------------------------
 */

(function(App, _){
    
    var View = App.View;
    var Model = App.Model;
    var Collection = App.Collection;
    
    _.mixin({
        
        /*
         |----------------------------------------------------------------
         | Is element
         |----------------------------------------------------------------
         */
        
        isElement: function (obj) {
            if (!obj) return false;
            if (typeof HTMLElement === 'object') {
                return obj instanceof HTMLElement;
            }
            return obj.nodeType > 0 && typeof obj.nodeName == 'string';
        },
        
        /*
         |----------------------------------------------------------------
         | Is model
         |----------------------------------------------------------------
         */
        
        isModel: function (obj) {
            return obj && obj instanceof Model;
        },
        
        /*
         |----------------------------------------------------------------
         | Is collection
         |----------------------------------------------------------------
         */
        
        isCollection: function (obj) {
            return obj && obj instanceof Collection;
        },
        
        /*
         |----------------------------------------------------------------
         | Is view
         |----------------------------------------------------------------
         */
        
        isView: function (obj) {
            return obj && obj instanceof View;
        },
        
        /*
         |----------------------------------------------------------------
         | Format CSV row
         |----------------------------------------------------------------
         */
        
        formatCsvRow: function (data) {
            var clean = [];
            _.each(data, function (item) {
                if (item && item.indexOf && item.indexOf(',') >= 0) {
                    clean.push('"' + item + '"');
                } else {
                    clean.push(item);
                }
            });
            return clean.join(',');
        },
        
        /*
         |----------------------------------------------------------------
         | Force download
         |----------------------------------------------------------------
         */
        
        forceDownload: function (content, filename, mime) {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([content], {type: mime}));
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

    });
  
}(App, _));

/*
 |------------------------------------------------------------------------
 | App.js
 |------------------------------------------------------------------------
 */

(function(App, Backbone, _){
    
    var httpMethods = {
        'create': 'POST',
        'update': 'PUT',
        'patch': 'PATCH',
        'delete': 'DELETE',
        'read': 'GET'
    };
    
    Backbone.sync = function (method, model, options) {
        
        options || (options = {});
        
        _.defaults(options, {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });
        
        var httpMethod = httpMethods[method];
        var params = { type: httpMethod, dataType: 'json' };
        var prepare = (method === 'create' || method === 'update' || method === 'patch');
        var error = options.error;
        var success = options.success;
        var context = options.context;
        
        method = method == 'patch' ? 'update' : method;
        
        if (!options.url) {
            params.url = App.url(model.urlRoot);
            params.url += method == 'read' ? '' : '/' + method;
            params.url += _.isCollection(model) || method == 'create' ? '' : '/' + model.id;
            params.url += '.json';
        }
        
        if (options.data == null && model && prepare) {
            var data = model.prepare();
            if (data instanceof FormData) {
                params.async = false;
                params.cache = false;
                params.data = data;
                params.contentType = false;
                params.processData = false;
                params.enctype = 'multipart/form-data';
            } else {
                params.contentType = 'application/json';
                params.data = JSON.stringify(data);
            }
        }
        
        if (params.type !== 'GET' && !options.emulateJSON) {
            params.processData = false;
        }
        
        options.error = function(xhr, message, err) {
            options.textStatus = message;
            options.errorThrown = err;
            if (error) error.call(context, xhr, message, err);
        }
        
        options.success = function(data, message, xhr) {
            if (data && data.error) {
                options.textStatus = data.error;
                options.errorThrown = data;
                options.validationError = data.error;
                if (error) error.call(context, xhr, data.error, data);
            } else {
                if (success) success.call(context, data);
            }
        }
        
        var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
        model.trigger('request', model, xhr, options);
        return xhr;
        
    }
    
}(App, Backbone, _));

/*
 |------------------------------------------------------------------------
 | App: Alert
 |------------------------------------------------------------------------
 */

(function(App){
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Alert = Backbone.View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            options || (options = {});
            this.options = options;
            this.initElement();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function (options) {
            var $message = this.$el.find('[data-element="message"]');
            if ($message.length > 0) {
                this.messageElement = $message[0];
            } else {
                this.messageElement = this.$el[0];
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var message = this.options.message;
            if (message) {
                this.messageElement.innerHTML = message;
                this.show();
            } else {
                this.messageElement.innerHTML = '';
                this.hide();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Set
         |----------------------------------------------------------------
         */
        
        set: function (message) {
            this.options.message = message;
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Clear
         |----------------------------------------------------------------
         */
        
        clear: function () {
            this.options.message = undefined;
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Show
         |----------------------------------------------------------------
         */
        
        show: function (message) {
            this.$el.removeClass('d-none');
        },
        
        /*
         |----------------------------------------------------------------
         | Hide
         |----------------------------------------------------------------
         */
        
        hide: function () {
            this.$el.addClass('d-none');
        },
        
    });
    
    App.Alert = Alert;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Profile
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Profile = View.extend({
        
        formats: {},
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            if (!this.model) return;
            this.populate();
        },
        
        /*
         |----------------------------------------------------------------
         | Populate
         |----------------------------------------------------------------
         */
        
        populate: function () {
            var model = this.model;
            var formats = this.formats;
            var field, format, value;
            this.$el.find('[data-field]').each(function () {
                field = this.getAttribute('data-field')
                format = formats[field];
                value = model.get(field);
                if (format) {
                    value = format.call(model, value);
                }
                this.innerHTML = '';
                if (_.isElement(value)) {
                    this.appendChild(value);
                } else {
                    this.innerHTML = value;
                }
            });
        }
        
    });
    
    /*
     |--------------------------------------------------------------------
     | Formats
     |--------------------------------------------------------------------
     */
    
    Profile.formats = {
        date: function (value) {
            if (!value) return 'N/A';
            value = value.toString().replace('T00:00:00+00:00', '');
            return moment(value).format('MM/DD/YYYY');
        },
        currency: function (value) {
            if (!value || !_.isNumber(value)) return '$ -';
            value = value.toFixed(2).toString();
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            return '$ ' + value;
        },
        createdBy: function (user) {
            if (!user) return 'Anonymous';
            return user.username.split('@')[0];
        },
        modifiedBy: function (user) {
            if (!user) return 'Anonymous';
            return user.username.split('@')[0];
        }
    };
    
    App.Profile = Profile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Form
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Form = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.populate();
        },
        
        /*
         |----------------------------------------------------------------
         | Populate
         |----------------------------------------------------------------
         */

        populate: function () {
            var $elem = this.$el;
            var model = this.model;
            var attr, value, $this;
            if (!model) return;
            $elem.find('[data-field]').each(function (input) {
                attr = this.getAttribute('data-field');
                if (!model.has(attr)) return;
                value = model.get(attr);
                $this = $(this);
                if (this.type == 'date') {
                    if (!value) return;
                    value = value.toString().split('T00:00:00+00:00')[0];
                    value = moment(value).format('YYYY-MM-DD');
                }
                $this.val(value);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Serialize
         |----------------------------------------------------------------
         */

        toModel: function () {
            var $elem = this.$el;
            var model = this.model;
            if (!model) return;
            $elem.find('[data-field]').each(function (input) {
                var attr = this.getAttribute('data-field');
                var value = $(this).val();
                model.set(attr, value);
            });
            return model;
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var form = this;
            var model = this.toModel();
            if (!model.isValid()) {
                this.trigger('error', model.validationError);
                return;
            }
            this.loading(true);
            model.save(model.attributes, {
                validate: false,
                success: function (model, response, options) {
                    form.loading(false);
                    if (!response.error) {
                        form.trigger('success', model);
                    } else {
                        form.trigger('error', response.error);
                    }
                },
                error: function (model, response, options, err) {
                    var message = 'An unexpected error occured';
                    if (options && options.validationError) {
                        message = options.validationError;
                    }
                    form.loading(false);
                    form.trigger('error', message);
                }
            });
        },
        
    });
    
    App.Form = Form;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Modal
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Modal = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        constructor: function (options) {
            View.call(this, options);
            this.addBootstrapEvents();
        },
        
        /*
         |----------------------------------------------------------------
         | Add bootstrap events
         |----------------------------------------------------------------
         */
        
        addBootstrapEvents: function () {
            var self = this;
            this.$el.on('show.bs.modal', function (event) {
                self.trigger('show', event);
            });
            this.$el.on('shown.bs.modal', function (event) {
                self.trigger('shown', event);
            });
            this.$el.on('hide.bs.modal', function (event) {
                self.trigger('hide', event);
            });
            this.$el.on('hidden.bs.modal', function (event) {
                self.trigger('hidden', event);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Open
         |----------------------------------------------------------------
         */
        
        open: function () {
            $(this.el).modal('show');
        },
        
        /*
         |----------------------------------------------------------------
         | Close
         |----------------------------------------------------------------
         */
        
        close: function () {
            $(this.el).modal('hide');
        },
        
        /*
         |----------------------------------------------------------------
         | Handle update
         |----------------------------------------------------------------
         */
        
        handleUpdate: function () {
            $(this.el).modal('handleUpdate');
        },
        
        /*
         |----------------------------------------------------------------
         | Swap
         |----------------------------------------------------------------
         */
        
        swap: function (modal) {
            this.once('hidden', function () {
                modal.once('shown', function () {
                    modal.handleUpdate();
                });
                modal.open();
            });
            this.close();
        },
        
    });
    
    App.Modal = Modal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = View.extend({
        
        reset: function (model) {
            this.model = model;
            this.render();
        }
        
    });
    
    App.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Searchbox
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Searchbox = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Value
         |----------------------------------------------------------------
         */
        
        value: function () {
            return this.$el.val();
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function (value) {
            this.$el.val(value);
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'input': 'search'
        },
        
        /*
         |----------------------------------------------------------------
         | Search
         |----------------------------------------------------------------
         */
        
        search: function () {
            this.trigger('search', this.value());
        },
        
    });
    
    App.Searchbox = Searchbox;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Pagination
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Pagination = View.extend({
        
        pageNum: 1,
        pageMax: 1,
        pageLimit: 10,
        
        initialize: function () {
            this.initElement();
        },
        
        initElement: function () {
            var $elem = this.$el;
            var $prev = $elem.find('[data-action="prev"]');
            var $next = $elem.find('[data-action="next"]');
            var $last = $elem.find('[data-action="last"]');
            var $first = $elem.find('[data-action="first"]');
            var $limit = $elem.find('[data-action="limit"]');
            var $pagenum = $elem.find('[data-label="page-num"]');
            var $pagemax = $elem.find('[data-label="page-max"]');
            this.$prev = $prev.parent();
            this.$next = $next.parent();
            this.$last = $last.parent();
            this.$first = $first.parent();
            this.$limit = $limit;
            this.$pagenum = $pagenum;
            this.$pagemax = $pagemax;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var page = this.pageNum;
            var last = this.pageMax;
            if (page == 1) {
                this.$first.addClass('disabled');
                this.$prev.addClass('disabled');
            } else {
                this.$first.removeClass('disabled');
                this.$prev.removeClass('disabled');
            }
            if (page == last) {
                this.$next.addClass('disabled');
                this.$last.addClass('disabled');
            } else {
                this.$next.removeClass('disabled');
                this.$last.removeClass('disabled');
            }
            this.$pagenum[0].innerHTML = page;
            this.$pagemax[0].innerHTML = last;
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function (page, max, limit) {
            this.pageNum = page;
            this.pageMax = max;
            this.pageLimit = limit;
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="first"]': 'first',
            'click [data-action="prev"]': 'prev',
            'click [data-action="next"]': 'next',
            'click [data-action="last"]': 'last',
            'change [data-action="limit"]': 'limit'
        },
        
        /*
         |----------------------------------------------------------------
         | First page
         |----------------------------------------------------------------
         */
        
        first: function (event) {
            event.preventDefault();
            this.trigger('first');
        },
        
        /*
         |----------------------------------------------------------------
         | Previous page
         |----------------------------------------------------------------
         */
        
        prev: function (event) {
            event.preventDefault();
            this.trigger('prev');
        },
        
        /*
         |----------------------------------------------------------------
         | Next page
         |----------------------------------------------------------------
         */
        
        next: function (event) {
            event.preventDefault();
            this.trigger('next');
        },
        
        /*
         |----------------------------------------------------------------
         | Last page
         |----------------------------------------------------------------
         */
        
        last: function (event) {
            event.preventDefault();
            this.trigger('last');
        },
        
        /*
         |----------------------------------------------------------------
         | Limit
         |----------------------------------------------------------------
         */
        
        limit: function () {
            this.trigger('limit', parseInt(this.$limit.val()));
        },
        
    });
    
    App.Pagination = Pagination;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App: Table
 |------------------------------------------------------------------------
 */

(function(App, _){
    
    var View = App.View;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Table = View.extend({
        
        defaults: {
            page: 1,
            limit: 10,
            paginate: true,
            searchable: true,
            searchText: undefined,
            searchFields: undefined,
            selectable: true,
            sortable: true,
            sortOrder: 'asc',
            sortField: 'id',
            idAttribute: 'id',
        },
        
        options: undefined,
        thead: undefined,
        tbody: undefined,
        tfoot: undefined,
        theadRow: undefined,
        columns: undefined,
        maxPage: 1,
        selected: undefined,
        formats: {},
        emptyMessage: 'No records found',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (params) {
            var options = this.initOptions(params);
            this.initElement();
            this.initColumns();
            this.initRecords();
            if (options.emptyMessage) {
                this.emptyMessage = options.emptyMessage;
            }
            if (options.searchable && options.searchbox) {
                this.initSearchbox();
            }
            if (options.paginate && options.pagination) {
                this.initPagination();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize options
         |----------------------------------------------------------------
         */
        
        initOptions: function (params) {
            var options = _.extend({}, this.defaults, params);
            if (options.formats) {
                var formats = this.formats;
                _.each(options.formats, function (cb, field) {
                    formats[field] = cb;
                });
            }
            this.options = options;
            return options;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var elem = this.el;
            var thead = elem.tHead;
            var tbody = elem.tBodies[0];
            var tfoot = elem.tFoot;
            if (!thead) {
                thead = document.createElement('thead');
                elem.appendChild(thead);
            }
            if (!tbody) {
                tbody = document.createElement('tbody');
                elem.appendChild(tbody);
            }
            if (!tfoot) {
                tfoot = document.createElement('tfoot');
                elem.appendChild(tfoot);
            }
            var theadRow = thead.rows[0];
            if (!theadRow) {
                tr = document.createElement('tr');
                thead.appendChild(tr);
            }
            this.thead = thead;
            this.tbody = tbody;
            this.tfoot = tfoot;
            this.theadRow = theadRow;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize columns
         |----------------------------------------------------------------
         */
        
        initColumns: function () {
            var columns = [];
            var column;
            _.each(this.theadRow.cells, function (cell) {
                column = {
                    field: undefined,
                    title: undefined,
                    visible: true,
                    cellClass: undefined,
                    sortable: true,
                };
                if (cell.hasAttribute('data-field')) {
                    column.field = cell.getAttribute('data-field')
                }
                if (cell.hasAttribute('data-title')) {
                    column.title = cell.getAttribute('data-title')
                } else {
                    column.title = cell.innerHTML;
                }
                if (cell.hasAttribute('data-sortable')) {
                    column.sortable = cell.getAttribute('data-sortable') == 'true';
                }
                if (cell.hasAttribute('data-visible')) {
                    column.visible = cell.getAttribute('data-visible') == 'true';
                }
                if (cell.hasAttribute('data-cell-class')) {
                    column.cellClass = cell.getAttribute('data-cell-class');
                }
                columns.push(column);
            });
            this.columns = columns;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize records
         |----------------------------------------------------------------
         */
        
        initRecords: function () {
            var table = this;
            var collection = this.collection;
            collection.on('update', function () {
                table.renderBody();
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var table = this;
            var searchbox = this.options.searchbox;
            
            searchbox.on('search', function (text) {
                table.search(text);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var table = this;
            var options = this.options;
            var pagination = this.options.pagination;
            
            pagination.on('limit', function (value) {
                table.limit(value);
            });
            
            pagination.on('first', function () {
                table.page(1);
            });
            
            pagination.on('prev', function () {
                table.page(table.options.page - 1);
            });
            
            pagination.on('next', function () {
                table.page(table.options.page + 1);
            });
            
            pagination.on('last', function () {
                table.page(table.maxPage);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.renderHead();
            this.renderBody();
            this.renderFoot();
        },
        
        /*
         |----------------------------------------------------------------
         | Render head
         |----------------------------------------------------------------
         */
        
        renderHead: function () {
            var options = this.options;
            var columns = this.columns;
            var theadRow = this.theadRow;
            var classes;
            theadRow.innerHTML = '';
            _.each(columns, function (column) {
                if (!column.visible) return;
                classes = [];
                var th = document.createElement('th');
                th.innerHTML = column.title;
                th.setAttribute('data-field', column.field);
                if (column.cellClass) {
                    classes.push(column.cellClass);
                }
                if (column.sortable) {
                    classes.push('sortable');
                    if (options.sortField && options.sortOrder && options.sortField == column.field) {
                        classes.push(options.sortOrder);
                    }
                }
                th.className = classes.join(' ');
                theadRow.appendChild(th);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Render body
         |----------------------------------------------------------------
         */
        
        renderBody: function () {
            var tbody = this.tbody;
            var options = this.options;
            var columns = this.columns;
            var collection = this.collection.clone();
            var page = options.page;
            var limit = options.limit;
            var sortable = options.sortable;
            var sortField = options.sortField;
            var sortOrder = options.sortOrder;
            var searchable = options.searchable;
            var searchText = options.searchText;
            var searchFields = options.searchFields;
            var formats = this.formats;
            var tr, td, field, value, format;
            
            tbody.innerHTML = '';
            
            if (collection.length == 0) {
                return this.renderBodyEmpty(this.emptyMessage);
            }
            
            if (searchable && searchText) {
                collection = collection.search(searchText, searchFields);
            }
            
            if (collection.length == 0) {
                return this.renderBodyEmpty('No records found matching your criterion');
            }
            
            if (sortable && sortField && sortOrder) {
                collection.comparator = sortField;
                collection.sort();
                if (sortOrder !== 'asc') {
                    collection.models.reverse();
                }
            }
            
            this.maxPage = Math.ceil(collection.length / limit);
            
            if (options.paginate) {
                collection.reset(collection.limit(limit, page), {sort: false});
            }
            
            collection.each(function (model) {
                tr = document.createElement('tr');
                tr.setAttribute('data-id', model.id);
                _.each(columns, function (column) {
                    if (!column.visible) return;
                    td = document.createElement('td');
                    field = column.field;
                    format = formats[field];
                    value = model.get(field);
                    if (format) {
                        value = format.call(model, value);
                    }
                    if (_.isElement(value)) {
                        td.appendChild(value);
                    } else {
                        td.innerHTML = value;
                    }
                    if (column.cellClass) {
                        td.className = column.cellClass;
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            
            if (options.pagination) {
                options.pagination.update(
                    options.page, this.maxPage, options.limit
                );
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Render body empty
         |----------------------------------------------------------------
         */
        
        renderBodyEmpty: function (message) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.className = 'table-warning';
            td.setAttribute('colspan', this.columns.length);
            td.innerHTML = message;
            tr.appendChild(td);
            this.tbody.appendChild(tr);
            this.trigger('empty');
        },
        
        format: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render foot
         |----------------------------------------------------------------
         */
        
        renderFoot: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Sort
         |----------------------------------------------------------------
         */
        
        sort: function (field, order) {
            order = order === 'desc' ? 'desc' : 'asc';
            var options = this.options;
            if (options.field !== field || options.dir !== dir) {
                this.options.page = 1;
                this.options.sortField = field;
                this.options.sortOrder = order;
                this.renderHead();
                this.renderBody();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Page
         |----------------------------------------------------------------
         */
        
        page: function (value) {
            var min = 1;
            var max = this.maxPage;
            var options = this.options;
            if (!options.paginate) return;
            if (value >= min && value <= max && value !== options.page) {
                this.options.page = value;
                this.renderBody();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Limit
         |----------------------------------------------------------------
         */
        
        limit: function (value) {
            var options = this.options;
            if (!options.paginate) return;
            if (value !== options.limit) {
                this.options.page = 1;
                this.options.limit = value;
                this.renderBody();
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Search
         |----------------------------------------------------------------
         */
        
        search: function (value) {
            var options = this.options;
            var searchbox = options.searchbox;
            if (!options.searchable) return;
            this.options.page = 1;
            this.options.searchText = value;
            this.renderBody();
            if (searchbox.value() !== value) {
                searchbox.update(value);
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Select
         |----------------------------------------------------------------
         */
        
        select: function (id) {
            if (!this.options.selectable) return;
            this.deselect();
            var selected = this.collection.get(id);
            if (selected) {
                var $row = $(this.tbody).find('[data-id="' + id +  '"]');
                this.selected = selected;
                this.trigger('select', selected);
                $row.addClass('table-active');
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Deselect
         |----------------------------------------------------------------
         */
        
        deselect: function () {
            if (!this.options.selectable) return;
            var selected = this.selected;
            this.selected = undefined;
            if (selected) {
                this.trigger('deselect', selected);
            }
            $(this.tbody).find('tr.table-active').removeClass('table-active');
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click th.sortable': 'clickSort',
            'click tbody tr': 'clickRow',
            'dblclick tbody tr': 'dblclickRow',
        },
        
        /*
         |----------------------------------------------------------------
         | Click sort
         |----------------------------------------------------------------
         */
        
        clickSort: function (event) {
            var th = event.currentTarget;
            var field = th.getAttribute('data-field');
            var order = 'asc';
            if (!field) return;
            if (this.options.sortField == field) {
                order = this.options.sortOrder == 'asc' ? 'desc' : 'asc';
            }
            this.sort(field, order);
        },
        
        /*
         |----------------------------------------------------------------
         | Click row
         |----------------------------------------------------------------
         */
        
        clickRow: function (event) {
            var row = event.currentTarget;
            var id = row.getAttribute('data-id');
            var selected = this.selected;
            if (selected && selected.id == id) {
                this.deselect();
                return;
            }
            this.select(id);
        },
        
        /*
         |----------------------------------------------------------------
         | Double click row
         |----------------------------------------------------------------
         */
        
        dblclickRow: function (event) {
            var row = event.currentTarget;
            var id = row.getAttribute('data-id');
            this.select(id);
            this.trigger('dblclick', this.selected);
        },
        
    });
    
    /*
     |--------------------------------------------------------------------
     | Formats
     |--------------------------------------------------------------------
     */
    
    var mimeIcons = {
        // PDF
        'application/pdf': 'file-pdf-o',
        // Code
        'application/javascript': 'file-code-o',
        'application/json': 'file-code-o',
        'application/xml': 'file-code-o',
        'application/sql': 'file-code-o',
        'text/css': 'file-code-o',
        'text/html': 'file-code-o',
        // Word
        'application/msword': 'file-word-o',
        // Excel
        'application/vnd.ms-excel': 'file-excel-o',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-excel-o',
        'text/csv': 'file-excel-o',
        // Powerpoint
        'application/vnd.ms-powerpoint (.ppt)': 'file-powerpoint-o',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'file-powerpoint-o',
        // Text
        'text/plain': 'file-text-o',
        // Archive
        'application/x-7z-compressed': 'file-archive-o',
        'application/x-rar-compressed': 'file-archive-o',
        'application/x-zip-compressed': 'file-archive-o',
        'application/zip': 'file-archive-o',
        // Image
        'image/png': 'file-image-o',
        'image/jpeg': 'file-image-o',
        'image/gif': 'file-image-o',
        // Video
        'video/x-flv': 'file-video-o',
        'video/mp4': 'file-video-o',
        'application/x-mpegURL': 'file-video-o',
        'video/MP2T': 'file-video-o',
        'video/3gpp': 'file-video-o',
        'video/quicktime': 'file-video-o',
        'video/x-msvideo': 'file-video-o',
        'video/x-ms-wmv': 'file-video-o',
        // Audio
        'audio/mpeg': 'file-audio-o',
        'audio/vorbis': 'file-audio-o',
    };
    
    Table.formats = {
        mime: function (value) {
            var span = document.createElement('span');
            span.className = 'fa fa-' + (value && mimeIcons[value] ? mimeIcons[value] : 'file-o');
            return span;
        },
        size: function (bytes) {
           var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
           if (bytes == 0) return '0 Byte';
           var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
           return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },
        date: function (value) {
            if (!value) return 'N/A';
            value = value.toString().replace('T00:00:00+00:00', '');
            return moment(value).format('MM/DD/YYYY');
        },
        currency: function (value) {
            if (!value || !_.isNumber(value)) return '$ -';
            value = value.toFixed(2).toString();
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            return '$ ' + value;
        },
        createdBy: function (user) {
            if (!user) return 'Anonymous';
            return user.username.split('@')[0];
        }
    };
    
    App.Table = Table;
    
}(App, _));

/*
 |------------------------------------------------------------------------
 | App\Accounts: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Accounts = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Attachments = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Comments = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Funds = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Investments = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.InvestorsAccounts = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Investors = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Offerings = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Statements = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Transactions = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {},
        typeDescription: function (type) {
            switch (type) {
                case 0: return 'Initial deposit';
                case 1: return 'Preferred payment (prorated)';
                case 2: return 'Preferred payment';
                case 3: return 'Drawdown';
                case '0': return 'Initial deposit';
                case '1': return 'Preferred payment (prorated)';
                case '2': return 'Preferred payment';
                case '3': return 'Drawdown';
                default: return 'Unknown';
            }
        }
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Users = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {}
    }
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'accounts',
        
        serverNode: 'accounts',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Accounts.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'attachments',
        
        serverNode: 'attachments',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Prepare
         |----------------------------------------------------------------
         */
        
        prepare: function () {
            var attrs = this.attributes;
            var formData = new FormData();
            formData.append('parent', attrs.parent);
            formData.append('parent_id', attrs.parent_id);
            formData.append('file', attrs.file);
            return formData;
        },
        
    });
    
    App.Attachments.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'comments',
        
        serverNode: 'comments',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.content) {
                return 'Comment cannot be empty';
            }
        }
        
    });
    
    App.Comments.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'funds',
        
        serverNode: 'funds',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Funds.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'investments',
        
        serverNode: 'investments',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.account_id) {
                return 'Please select an account';
            }
            if (!attrs.offering_id) {
                return 'Please select an offering';
            }
            if (!attrs.date) {
                return 'Please provide a date';
            }
            if (!attrs.amount) {
                return 'Please provide an amount';
            }
            if (!attrs.term || attrs.term < 1) {
                return 'Please provide a term';
            }
        }
        
    });
    
    App.Investments.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'investors-accounts',
        
        serverNode: 'investors-accounts',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.InvestorsAccounts.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'investors',
        
        serverNode: 'investors',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Investors.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'offerings',
        
        serverNode: 'offerings',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Offerings.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'statements',
        
        serverNode: 'statements',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Statements.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'transactions',
        
        serverNode: 'transactions',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.investment_id) {
                return 'Please select an investment';
            }
            if (!attrs.date) {
                return 'Please provide a date';
            }
            if (!attrs.amount) {
                return 'Please provide an amount';
            }
            if (attrs.type == 3 &&
                attrs.max_amount !== undefined &&
                attrs.max_amount < attrs.amount) {
                return 'A drawdown cannot be greater than the balance';
            }
        }
        
    });
    
    App.Transactions.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: Model
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Model.extend({
        
        defaults: {},
        
        urlRoot: 'users',
        
        serverNode: 'users',
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            
        }
        
    });
    
    App.Users.Model = Model;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Accounts.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Accounts.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Attachments.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Attachments.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Comments.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Comments.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Funds.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Funds.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Investments.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Investments.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.InvestorsAccounts.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.InvestorsAccounts.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Investors.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Investors.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Offerings.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Offerings.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Statements.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Statements.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Transactions.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Transactions.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: Collection
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Model = App.Users.Model;
    
    var Collection = App.Collection.extend({
        
        model: Model,
        urlRoot: Model.prototype.urlRoot
        
    });
    
    App.Users.Collection = Collection;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Accounts.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Attachments.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Comments.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Funds.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Investments.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.InvestorsAccounts.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Investors.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Offerings.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Statements.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Transactions.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: View
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View.extend({
        
    });
    
    App.Users.View = View;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Accounts.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            $download = $elem.find('[data-action="download"]');
            this.$read = $read;
            this.$delete = $delete;
            this.$update = $update;
            this.$download = $download;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
            this.$download.prop('disabled', value);
        }
        
    });
    
    App.Attachments.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Comments.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Funds.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Investments.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.InvestorsAccounts.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Investors.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Offerings.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $download = $elem.find('[data-action="download"]');
            this.$download = $download;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$download.prop('disabled', value);
        }
        
    });
    
    App.Statements.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $update = $elem.find('[data-action="update"]');
            $delete = $elem.find('[data-action="delete"]');
            this.$read = $read;
            this.$update = $update;
            this.$delete = $delete;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$read.prop('disabled', value);
            this.$update.prop('disabled', value);
            this.$delete.prop('disabled', value);
        }
        
    });
    
    App.Transactions.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: Toolbar
 |------------------------------------------------------------------------
 */

(function(App){

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Toolbar = App.Toolbar.extend({
     
        /*
         |----------------------------------------------------------------
         | Constructor
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $elem = this.$el;
            $read = $elem.find('[data-action="read"]');
            $resetPassword = $elem.find('[data-action="reset-password"]');
            $changeRole = $elem.find('[data-action="change-role"]');
            $lock = $elem.find('[data-action="lock"]');
            $unlock = $elem.find('[data-action="unlock"]');
            
            this.$resetPassword = $resetPassword;
            this.$changeRole = $changeRole;
            this.$lock = $lock;
            this.$unlock = $unlock;
        },
     
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var value = !this.model;
            this.$resetPassword.prop('disabled', value);
            this.$changeRole.prop('disabled', value);
            this.$lock.prop('disabled', value);
            this.$unlock.prop('disabled', value);
        }
        
    });
    
    App.Users.Toolbar = Toolbar;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var AccountsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: function (value) {
                value || (value = 5)
                var types = [
                    null,
                    'Personal',
                    'Business',
                    'IRA',
                    '401K',
                    'Other'
                ];
                return types[value];
            },
            investments_amount: Table.formats.currency,
            investments_balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Accounts.Table = AccountsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var AttachmentsTable = Table.extend({
        
        emptyMessage: 'No attachments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            mime: Table.formats.mime,
            size: Table.formats.size,
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Attachments.Table = AttachmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var CommentsTable = Table.extend({
        
        emptyMessage: 'No comments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            created_by: function (model) {
                if (!model) return 'Anonymous';
                return model.username.split('@')[0];
            },
            modified_by: function () {
                
            },
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Comments.Table = CommentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var FundsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'investments_amount': Table.formats.currency,
            'investments_balance': Table.formats.currency,
            'created': Table.formats.date,
            'modified': Table.formats.date,
        }
        
    });
    
    App.Funds.Table = FundsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var statusTypes = [
        'Pending',
        'Open',
        'Closed'
    ];
    
    var InvestmentsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            status: function (value) {
                value || (value = 1);
                return statusTypes[value];
            },
            fund: function () {
                var offering = this.get('offering');
                var fund = offering.fund;
                return fund.name;
            },
            account: function (account) {
                return account.name;
            },
            date: Table.formats.date,
            amount: Table.formats.currency,
            balance: Table.formats.currency,
            preferred_payment: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Investments.Table = InvestmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestorsAccountsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
        }
        
    });
    
    App.InvestorsAccounts.Table = InvestorsAccountsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestorsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'investments_amount': Table.formats.currency,
            'investments_balance': Table.formats.currency,
            'created': Table.formats.date,
            'modified': Table.formats.date,
        }
        
    });
    
    App.Investors.Table = InvestorsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var OfferingsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            date: Table.formats.date,
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            capacity: Table.formats.currency,
            investments_amount: Table.formats.currency,
            investments_balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Offerings.Table = OfferingsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var StatementsTable = Table.extend({
        
        emptyMessage: 'No statements found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: function () {
                var span = document.createElement('span');
                span.className = 'fa fa-file-pdf-o';
                return span;
            },
            correct: function (value) {
                var span = document.createElement('span');
                if (value) {
                    span.className = 'fa fa-check text-success';
                } else {
                    span.className = 'fa fa-times text-danger';
                }
                return span;
            },
            date: Table.formats.date,
            size: Table.formats.size
        }
        
    });
    
    App.Statements.Table = StatementsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var TransactionsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: App.Transactions.typeDescription,
            date: Table.formats.date,
            amount: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Transactions.Table = TransactionsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: Table
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    var roles = [
        'Read only',
        'User',
        'Admin',
        'Super admin'
    ];
    
    var UsersTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            role: function (role) {
                return roles[role];
            },
            active: function (bool) {
                var span = document.createElement('span');
                if (bool) {
                    span.className = 'fa fa-check text-success';
                } else {
                    span.className = 'fa fa-times text-danger';
                }
                return span;
            },
            locked: function (bool) {
                var span = document.createElement('span');
                if (bool) {
                    span.className = 'fa fa-lock text-danger';
                } else {
                    span.className = 'fa fa-unlock text-success';
                }
                return span;
            }
        }
        
    });
    
    App.Users.Table = UsersTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Accounts.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Accounts.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            var $input = this.$el.find('[data-field="file"]');
            var $label = $input.siblings('span');
            $input.on('change', function () {
                var file = this.files[0];
                if (file) {
                    $label.html(file.name);
                } else {
                    $label.html('');
                }
            });
            this.$input = $input;
        },
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function () {
            var input = this.$input[0];
            var file = input.files[0];
            if (!file) {
                return 'Please select a file';
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var form = this;
            var model = this.model;
            var error = this.validate();
            if (error) {
                this.trigger('error', error);
            }
            model.set('file', this.$input[0].files[0]);
            this.loading(true);
            
            model.save(model.attributes, {
                success: function (model, response, options) {
                    form.loading(false);
                    if (!response.error) {
                        form.trigger('success', model);
                    } else {
                        form.trigger('error', response.error);
                    }
                },
                error: function (model, response, options) {
                    form.loading(false);
                    form.trigger('error', 'An unexpected error occured');
                }
            });
        },
        
    });
    
    App.Attachments.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Attachments.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Comments.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Comments.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Funds.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Funds.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Form: Apply transactions add
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsAddForm = Form.extend({
        
        investors: undefined,
        accounts: undefined,
        investments: undefined,

        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
    
        initialize: function (options) {
            this.investors = options.investors;
            this.accounts = options.accounts;
            this.investments = options.investments;
            this.initElement();
            this.initDropdowns();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
    
        initElement: function (options) {
            var $elem = this.$el;
            var $investors = $elem.find('[name="investor"]');
            var $accounts = $elem.find('[name="account"]');
            var $investments = $elem.find('[name="investment_id"]');
            this.$investors = $investors;
            this.$accounts = $accounts;
            this.$investments = $investments;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize dropdowns
         |----------------------------------------------------------------
         */
        
        initDropdowns: function () {
            this.initInvestorsDropdown();
            this.initAccountsDropdown();
            this.initInvestmentsDropdown();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investors dropdown
         |----------------------------------------------------------------
         */
    
        initInvestorsDropdown: function () {
            var self = this;
            var $select = this.$investors;
            var select = $select[0];
            var option;
            
            this.investors.each(function (model) {
                if (model.get('investments_balance') <= 0) {
                    return;
                }
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            $select.on('change', function () {
                self.trigger('investor-change', $select.val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize accounts dropdown
         |----------------------------------------------------------------
         */
    
        initAccountsDropdown: function () {
            var self = this;
            var $select = this.$accounts;
            var select = $select[0];
            var option;
            
            this.accounts.each(function (model) {
                if (model.get('investments_balance') <= 0) {
                    return;
                }
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                option.setAttribute('data-id', model.id);
                option.setAttribute('data-parent', model.get('investor_id'));
                select.appendChild(option);
            });
            
            this.on('investor-change', function (id) {
                self.updateAccountsDropdown(id);
            });
            
            $select.on('change', function () {
                self.trigger('account-change', $select.val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investments dropdown
         |----------------------------------------------------------------
         */
    
        initInvestmentsDropdown: function () {
            var self = this;
            var $select = this.$investments;
            var select = $select[0];
            var option, balance, clientId, date, fund, title;
            
            this.investments.each(function (model) {
                balance = model.get('balance');
                if (balance <= 0) {
                    return;
                }
                clientId = model.get('client_id');
                date = moment(model.get('date')).format('MM/DD/YYYY');
                balance = balance.toFixed(2).toString();
                balance = balance.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                fund = model.get('offering_fund_name');
                title = clientId + ' : ' + date + ' - $' + balance + ' - ' + fund;
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = title;
                option.setAttribute('data-id', model.id);
                option.setAttribute('data-parent', model.get('account_id'));
                select.appendChild(option);
            });
            
            this.on('account-change', function (id) {
                self.updateInvestmentsDropdown(id);
            });
            
            $select.on('change', function () {
                self.trigger('investment-change', $select.val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateAccountsDropdown: function (parent) {
            var $select = this.$accounts;
            $select.val('');
            $select.find('[data-id]').addClass('d-none');
            if (!parent) {
                this.trigger('account-change');
                $select.prop('disabled', true);
                return;
            }
            $select.prop('disabled', false);
            $items = $select.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            if ($items.length) {
                $select.val($items[0].value);
            }
            this.trigger('account-change', $select.val());
        },
        
        /*
         |----------------------------------------------------------------
         | Update investments dropdown
         |----------------------------------------------------------------
         */
        
        updateInvestmentsDropdown: function (parent) {
            var $select = this.$investments;
            $select.val('');
            $select.find('[data-id]').addClass('d-none');
            if (!parent) {
                this.trigger('investment-change');
                $select.prop('disabled', true);
                return;
            }
            $select.prop('disabled', false);
            $items = $select.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            if ($items.length) {
                $select.val($items[0].value);
            }
            this.trigger('investment-change', $select.val());
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.populate();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var model = this.toModel();
            if (!model.isValid()) {
                this.trigger('error', model.validationError);
                return;
            }
            this.trigger('success', model);
        },
        
    });
    
    App.Investments.ApplyTransactionsAddForm = ApplyTransactionsAddForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,

        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
    
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            
            this.initElement();
            this.initDropdowns();
            
            this.$ach = $('#investments-create-ach');
            var $achForm = $('#investments-create-ach-form');
            this.$ach.on('change', function () {
                if (this.value == 'on') {
                    $achForm.removeClass('d-none');
                } else {
                    $achForm.addClass('d-none');
                }
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
    
        initElement: function (options) {
            var $elem = this.$el;
            var $funds = $elem.find('[name="fund"]');
            var $offerings = $elem.find('[name="offering_id"]');
            var $investors = $elem.find('[name="investor"]');
            var $accounts = $elem.find('[name="account_id"]');
            this.$funds = $funds;
            this.$offerings = $offerings;
            this.$investors = $investors;
            this.$accounts = $accounts;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize dropdowns
         |----------------------------------------------------------------
         */
        
        initDropdowns: function () {
            this.initFundsDropdown();
            this.initAccountsDropdown();
            this.initOfferingsDropdown();
            this.initInvestorsDropdown();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize funds dropdown
         |----------------------------------------------------------------
         */
    
        initFundsDropdown: function () {
            var self = this;
            var select = this.$funds[0];
            var option;
            
            this.funds.each(function (model) {
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            this.$funds.on('change', function () {
                self.updateOfferingsDropdown($(this).val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize offerings dropdown
         |----------------------------------------------------------------
         */
    
        initOfferingsDropdown: function () {
            var select = this.$offerings[0];
            var option, id, label, date, rate;
            
            this.offerings.each(function (model) {
                id = model.get('id');
                date = model.get('date');
                date = date ? moment(date.toString().split('T')[0]).format('MM/DD/YYYY') : 'N/A';
                rate = model.get('rate');
                rate = (rate ? rate : 0).toFixed(3) + '%';
                option = document.createElement('option');
                option.value = id;
                option.innerHTML = date + ' - ' + rate;
                option.setAttribute('data-id', id);
                option.setAttribute('data-parent', model.get('fund_id'));
                select.appendChild(option);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investors dropdown
         |----------------------------------------------------------------
         */
    
        initInvestorsDropdown: function () {
            var self = this;
            var select = this.$investors[0];
            var option;
            
            this.investors.each(function (model) {
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            this.$investors.on('change', function () {
                self.updateAccountsDropdown($(this).val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize accounts dropdown
         |----------------------------------------------------------------
         */
    
        initAccountsDropdown: function () {
            var select = this.$accounts[0];
            var option, id;
            
            this.accounts.each(function (model) {
                id = model.get('id');
                option = document.createElement('option');
                option.value = id;
                option.innerHTML = model.get('name');
                option.setAttribute('data-id', id);
                option.setAttribute('data-parent', model.get('investor_id'));
                select.appendChild(option);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateOfferingsDropdown: function (parent) {
            var $elem = this.$offerings;
            $elem.val('');
            $elem.find('[data-id]').addClass('d-none');
            if (!parent) {
                $elem.prop('disabled', true);
                return;
            }
            $elem.prop('disabled', false);
            $items = $elem.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            $elem.val($items[$items.length - 1].value);
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateAccountsDropdown: function (parent) {
            var $elem = this.$accounts;
            $elem.val('');
            $elem.find('[data-id]').addClass('d-none');
            if (!parent) {
                $elem.prop('disabled', true);
                return;
            }
            $elem.prop('disabled', false);
            $items = $elem.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            $elem.val($items[0].value);
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.populate();
        },
        
    });
    
    App.Investments.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,

        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
    
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            
            this.initElement();
            this.initDropdowns();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
    
        initElement: function (options) {
            var $elem = this.$el;
            var $funds = $elem.find('[name="fund"]');
            var $offerings = $elem.find('[name="offering_id"]');
            var $investors = $elem.find('[name="investor"]');
            var $accounts = $elem.find('[name="account_id"]');
            this.$funds = $funds;
            this.$offerings = $offerings;
            this.$investors = $investors;
            this.$accounts = $accounts;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize dropdowns
         |----------------------------------------------------------------
         */
        
        initDropdowns: function () {
            this.initFundsDropdown();
            this.initAccountsDropdown();
            this.initOfferingsDropdown();
            this.initInvestorsDropdown();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize funds dropdown
         |----------------------------------------------------------------
         */
    
        initFundsDropdown: function () {
            var self = this;
            var select = this.$funds[0];
            var option;
            
            this.funds.each(function (model) {
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            this.$funds.on('change', function () {
                self.updateOfferingsDropdown($(this).val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize offerings dropdown
         |----------------------------------------------------------------
         */
    
        initOfferingsDropdown: function () {
            var select = this.$offerings[0];
            var option, id, label, date, rate;
            
            this.offerings.each(function (model) {
                id = model.get('id');
                date = model.get('date');
                date = date ? moment(date.toString().split('T')[0]).format('MM/DD/YYYY') : 'N/A';
                rate = model.get('rate');
                rate = (rate ? rate : 0).toFixed(3) + '%';
                option = document.createElement('option');
                option.value = id;
                option.innerHTML = date + ' - ' + rate;
                option.setAttribute('data-id', id);
                option.setAttribute('data-parent', model.get('fund_id'));
                select.appendChild(option);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investors dropdown
         |----------------------------------------------------------------
         */
    
        initInvestorsDropdown: function () {
            var self = this;
            var select = this.$investors[0];
            var option;
            
            this.investors.each(function (model) {
                option = document.createElement('option');
                option.value = model.get('id');
                option.innerHTML = model.get('name');
                select.appendChild(option);
            });
            
            this.$investors.on('change', function () {
                self.updateAccountsDropdown($(this).val());
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize accounts dropdown
         |----------------------------------------------------------------
         */
    
        initAccountsDropdown: function () {
            var select = this.$accounts[0];
            var option, id;
            
            this.accounts.each(function (model) {
                id = model.get('id');
                option = document.createElement('option');
                option.value = id;
                option.innerHTML = model.get('name');
                option.setAttribute('data-id', id);
                option.setAttribute('data-parent', model.get('investor_id'));
                select.appendChild(option);
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateOfferingsDropdown: function (parent) {
            var $elem = this.$offerings;
            $elem.val('');
            $elem.find('[data-id]').addClass('d-none');
            if (!parent) {
                $elem.prop('disabled', true);
                return;
            }
            $elem.prop('disabled', false);
            $items = $elem.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            $elem.val($items[$items.length - 1].value);
        },
        
        /*
         |----------------------------------------------------------------
         | Update accounts dropdown
         |----------------------------------------------------------------
         */
        
        updateAccountsDropdown: function (parent) {
            var $elem = this.$accounts;
            $elem.val('');
            $elem.find('[data-id]').addClass('d-none');
            if (!parent) {
                $elem.prop('disabled', true);
                return;
            }
            $elem.prop('disabled', false);
            $items = $elem.find('[data-parent="' + parent + '"]');
            $items.removeClass('d-none');
            $elem.val($items[0].value);
        },
        
        /*
         |----------------------------------------------------------------
         | Populate
         |----------------------------------------------------------------
         */
        
        populate: function () {
            Form.prototype.populate.call(this);
            var model = this.model;
            var accountId = model.get('account_id');
            var offeringId = model.get('offering_id');
            var account = this.accounts.get(accountId);
            var offering = this.offerings.get(offeringId);
            var fundId = offering.get('fund_id');
            var investorId = account.get('investor_id');
            this.$funds.val(fundId);
            this.$investors.val(investorId);
            this.updateOfferingsDropdown(fundId);
            this.updateAccountsDropdown(investorId);
            this.$accounts.val(accountId);
            this.$offerings.val(offeringId);
        },
        
    });
    
    App.Investments.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.InvestorsAccounts.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.InvestorsAccounts.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Investors.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Investors.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Offerings.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Offerings.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Statements.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Statements.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Transactions.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Transactions.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Form: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateForm = Form.extend({
        
    });
    
    App.Users.CreateForm = CreateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Form: Forgot password
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ForgotPasswordForm = Form.extend({
        
    });
    
    App.Users.ForgotPasswordForm = ForgotPasswordForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Form: Login
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var LoginForm = Form.extend({
        
        $submit: undefined,
        $submitIcon: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$submitIcon = $submitIcon;
            
            $submit.on('mouseover', function () {
                $submitIcon.removeClass('fa-lock');
                $submitIcon.addClass('fa-unlock');
            });
            
            $submit.on('mouseout', function () {
                $submitIcon.removeClass('fa-unlock');
                $submitIcon.addClass('fa-lock');
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var form = this;
            var model = this.toModel();
            var error = this.validate(model.attributes);
            if (error) {
                this.trigger('error', error);
                return;
            }
            this.loading(true);
            $.ajax({
                url: App.url('login') + '.json',
                type: 'post',
                dataType: 'json',
                data: {
                    username: model.get('username'),
                    password: model.get('password')
                },
                success: function (response) {
                    form.loading(false);
                    if (!response.success) {
                        form.trigger('error', response.error);
                    } else {
                        form.trigger('success', response.redirect);
                    }
                },
                error: function () {
                    form.loading(false);
                    form.trigger('error', 'An unexpected error occured');
                }
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Validate
         |----------------------------------------------------------------
         */
        
        validate: function (attrs) {
            if (!attrs.username) {
                return 'Please provide a username';
            }
            if (!attrs.password) {
                return 'Please provide a password';
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-lock');
            this.$submitIcon.removeClass('fa-unlock');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-lock');
        },
        
    });
    
    App.Users.LoginForm = LoginForm;
    
}(App));



/*
 |------------------------------------------------------------------------
 | App\Users\Form: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Form = App.Form;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateForm = Form.extend({
        
    });
    
    App.Users.UpdateForm = UpdateForm;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Accounts.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;
    
    var accountTypes = [
        null,
        'Personal',
        'Business',
        'IRA',
        '401K',
        'Other'
    ];
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: function (value) {
                value || (value = 5);
                return accountTypes[value];
            },
            address: function (valule) {
                return valule ? valule : 'N/A';
            },
            city_state_zip: function (value) {
                var city = this.get('city');
                var state = this.get('state');
                var zip = this.get('zip');
                if (!city && !state && !zip) {
                    return 'N/A';
                }
                if (city && !state && !zip) {
                    return city;
                }
                if (city && state && !zip) {
                    return city + ', ' + state;
                }
                if (city && state && zip) {
                    return city + ', ' + state + ' ' + zip;
                }
                if (!city && state && !zip) {
                    return state;
                }
                if (!city && state && zip) {
                    return state + ' ' + zip;
                }
                if (!city && !state && zip) {
                    return zip;
                }
            },
            investments_amount: Profile.formats.currency,
            investments_balance: Profile.formats.currency,
            created: Profile.formats.date,
            modified: function (date) {
                if (!date) return 'N/A';
                return moment(date).fromNow();
            },
            created_by: Profile.formats.createdBy,
            modified_by: Profile.formats.modifiedBy,
        }
        
    });
    
    App.Accounts.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Attachments.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'created': Profile.formats.date,
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Attachments.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Comments.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'created': Profile.formats.date,
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Comments.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Funds.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            investments_amount: Profile.formats.currency,
            investments_balance: Profile.formats.currency,
            created: Profile.formats.date,
            modified: function (date) {
                if (!date) return 'N/A';
                return moment(date).fromNow();
            },
            created_by: Profile.formats.createdBy,
            modified_by: Profile.formats.modifiedBy,
        }
        
    });
    
    App.Funds.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Investments.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;
    
    var statusTypes = [
        'Pending',
        'Open',
        'Closed'
    ];
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            fund: function (id) {
                var offering = this.get('offering');
                var fund = offering.fund;
                var link = document.createElement('a');
                link.innerHTML = fund.name;
                link.href = App.url('funds/' + fund.id);
                return link;
            },
            offering: function (offering) {
                var rate = offering.rate || 0;
                return offering.class + ' @ ' + rate.toFixed(3) + '%';
            },
            investor: function (id) {
                var account = this.get('account');
                var investor = account.investor;
                var link = document.createElement('a');
                link.innerHTML = investor.name;
                link.href = App.url('investors/' + investor.id);
                return link;
            },
            account: function (account) {
                return account.name;
            },
            status: function (value) {
                value || (value = 0);
                return statusTypes[value];
            },
            date: Profile.formats.date,
            amount: Profile.formats.currency,
            balance: Profile.formats.currency,
            preferred_payment: Profile.formats.currency,
            created: Profile.formats.date,
            modified: Profile.formats.date,
        }
        
    });
    
    App.Investments.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.InvestorsAccounts.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
        }
        
    });
    
    App.InvestorsAccounts.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Investors.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            address: function (valule) {
                return valule ? valule : 'N/A';
            },
            city_state_zip: function (value) {
                var city = this.get('city');
                var state = this.get('state');
                var zip = this.get('zip');
                if (!city && !state && !zip) {
                    return 'N/A';
                }
                if (city && !state && !zip) {
                    return city;
                }
                if (city && state && !zip) {
                    return city + ', ' + state;
                }
                if (city && state && zip) {
                    return city + ', ' + state + ' ' + zip;
                }
                if (!city && state && !zip) {
                    return state;
                }
                if (!city && state && zip) {
                    return state + ' ' + zip;
                }
                if (!city && !state && zip) {
                    return zip;
                }
            },
            investments_amount: Profile.formats.currency,
            investments_balance: Profile.formats.currency,
            created: Profile.formats.date,
            modified: function (date) {
                if (!date) return 'N/A';
                return moment(date).fromNow();
            },
            created_by: Profile.formats.createdBy,
            modified_by: Profile.formats.modifiedBy,
        }
        
    });
    
    App.Investors.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
        formats: {
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
        }
        
    });
    
    App.Offerings.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            date: Profile.formats.date,
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            capacity: Profile.formats.currency,
            investments_amount: Profile.formats.currency,
            investments_balance: Profile.formats.currency,
            created: Profile.formats.date,
            modified: function (date) {
                if (!date) return 'N/A';
                return moment(date).fromNow();
            },
            created_by: Profile.formats.createdBy,
            modified_by: Profile.formats.modifiedBy,
        }
        
    });
    
    App.Offerings.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Statements.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'created': Profile.formats.date,
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Statements.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Transactions.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            'date': Profile.formats.date,
            'amount': Profile.formats.currency,
            'created': Profile.formats.date,
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Transactions.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Profile: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var DeleteProfile = Profile.extend({
        
    });
    
    App.Users.DeleteProfile = DeleteProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            created: function (date) {
                return moment(date).fromNow(true);
            },
            'modified': Profile.formats.date,
        }
        
    });
    
    App.Users.ReadProfile = ReadProfile;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var Modal = App.Modal;
    var CreateForm = Accounts.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'accounts-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        closeOnSuccess: true,
        alertElement: 'accounts-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Accounts.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var Modal = App.Modal;
    var Profile = Accounts.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'accounts-delete-profile',
        alertElement: 'accounts-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Accounts.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var Modal = App.Modal;
    var Profile = Accounts.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        investmentsPanel: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initInvestments();
            this.initComments();
            this.initAttachments();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('accounts-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investments
         |----------------------------------------------------------------
         */
        
        initInvestments: function () {
            var Investments = App.Investments;
            var Collection = Investments.Collection;
            var investments = new Collection();
            var Panel = App.Accounts.InvestmentsPanel;
            var panel = new Panel({
                collection: investments,
                el: document.getElementById('accounts-investments-panel'),
            });
            this.investmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var Comments = App.Comments;
            var Collection = Comments.Collection;
            var comments = new Collection();
            var Panel = App.Accounts.CommentsPanel;
            var panel = new Panel({
                el: document.getElementById('accounts-comments-panel'),
                modal: this,
                collection: comments
            });
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var Attachments = App.Attachments;
            var Collection = Attachments.Collection;
            var attachments = new Collection();
            var Panel = App.Accounts.AttachmentsPanel;
            var panel = new Panel({
                el: document.getElementById('accounts-attachments-panel'),
                modal: this,
                collection: attachments
            });
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            $('#accounts-tab a:first').tab('show');
            this.investmentsPanel.reset(this.model);
            this.commentsPanel.reset(this.model);
            this.attachmentsPanel.reset(this.model);
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Accounts.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var Modal = App.Modal;
    var UpdateForm = Accounts.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'accounts-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'accounts-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Accounts.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var Modal = App.Modal;
    var CreateForm = Attachments.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'attachments-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'attachments-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Attachments.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var Modal = App.Modal;
    var Profile = Attachments.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'attachments-delete-profile',
        alertElement: 'attachments-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (model, xhr, options) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Attachments.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var Modal = App.Modal;
    var Profile = Attachments.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('attachments-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Attachments.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var Modal = App.Modal;
    var UpdateForm = Attachments.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'attachments-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'attachments-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Attachments.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var Modal = App.Modal;
    var CreateForm = Comments.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'comments-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'comments-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Comments.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var Modal = App.Modal;
    var Profile = Comments.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'comments-delete-profile',
        alertElement: 'comments-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Comments.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var Modal = App.Modal;
    var Profile = Comments.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('comments-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Comments.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var Modal = App.Modal;
    var UpdateForm = Comments.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'comments-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'comments-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Comments.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var Modal = App.Modal;
    var CreateForm = Funds.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'funds-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'funds-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Funds.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var Modal = App.Modal;
    var Profile = Funds.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'funds-delete-profile',
        alertElement: 'funds-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Funds.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var Modal = App.Modal;
    var Profile = Funds.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('funds-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Funds.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var Modal = App.Modal;
    var UpdateForm = Funds.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'funds-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'funds-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Funds.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Apply transactions add
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var CreateForm = Investments.ApplyTransactionsAddForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsAddModal = Modal.extend({
        
        investors: undefined,
        accounts: undefined,
        investments: undefined,
        
        form: undefined,
        formId: 'apply-transactions-add-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'apply-transactions-add-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.investors = options.investors;
            this.accounts = options.accounts;
            this.investments = options.investments;
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                investors: this.investors,
                accounts: this.accounts,
                investments: this.investments,
                el: document.getElementById(this.formId),
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |---------------------------------------------------------------------
         | Update investor
         |---------------------------------------------------------------------
         */
        
        updateInvestor: function (investor) {
            this.form.$investors.val(investor.id);
            this.form.updateAccountsDropdown(investor.id);
        },
        
        /*
         |---------------------------------------------------------------------
         | Update account
         |---------------------------------------------------------------------
         */
        
        updateAccount: function (account) {
            this.form.$accounts.val(account.id);
            this.form.updateInvestmentsDropdown(account.id);
        },
        
        /*
         |---------------------------------------------------------------------
         | Update investment
         |---------------------------------------------------------------------
         */
        
        updateInvestment: function (investment) {
            this.form.$investments.val(investment.id);
            this.form.trigger('investment-change', investment);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Investments.ApplyTransactionsAddModal = ApplyTransactionsAddModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Apply transactions import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Modal = App.Modal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsImportModal = Modal.extend({
        
        form: undefined,
        formId: 'apply-transactions-import-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'apply-transactions-import-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var $input = this.$el.find('[data-field="file"]');
            var $label = $input.siblings('span');
            $input.on('change', function () {
                var file = this.files[0];
                if (file) {
                    $label.html(file.name);
                } else {
                    $label.html('');
                }
            });
            this.$input = $input;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var self = this;
            var params = {};
            var alert = this.alert;
            var input = this.$input[0];
            var file = input.files[0];
            var data = new FormData();
            
            alert.clear();
            
            if (!file) {
                alert.set('Please select a file');
                return;
            }
            this.loading(true);
            
            data.append('file', file);
            
            params.url = App.url('/utility/csv-to-json.json');
            params.data = data;
            params.type = 'post';
            params.async = false;
            params.cache = false;
            params.contentType = false;
            params.processData = false;
            params.enctype = 'multipart/form-data';
            params.success = function (response) {
                if (!response.success) {
                    alert.set(response.error);
                } else {
                    self.trigger('success', response.data);
                    self.close();
                }
                self.loading(false);
            }
            params.error = function (response) {
                alert.set('An unexpected error occured');
                self.loading(false);
            }
            
            $.ajax(params);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-upload');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-upload');
        },
        
    });
    
    App.Investments.ApplyTransactionsImportModal = ApplyTransactionsImportModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Apply transactions submit
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Modal = App.Modal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ApplyTransactionsSubmitModal = Modal.extend({
        
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'apply-transactions-submit-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.initElement();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            var collection = this.collection;
            if (!collection) return;
            var totals = {
                '1': { count: 0, amount: 0 },
                '2': { count: 0, amount: 0 },
                '3': { count: 0, amount: 0 },
                total: { count: collection.length, amount: 0 },
            };
            collection.each(function (model) {
                var type = model.get('type').toString();
                var amount = model.get('amount');
                totals.total.amount += amount;
                totals[type].count ++;
                totals[type].amount += amount;
            });
            this.renderTable(totals);
        },
        
        /*
         |----------------------------------------------------------------
         | Render table
         |----------------------------------------------------------------
         */
        
        renderTable: function (totals) {
            var $elem = this.$el;
            _.each(totals, function (total, key) {
                $elem.find('[data-field="' + key + '-count"]').html(total.count);
                $elem.find('[data-field="' + key + '-amount"]').html(App.formats.currency(total.amount));
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (collection) {
            this.collection = collection;
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            if (this.isLoading()) return;
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            if (this.isLoading()) return;
            
            var self = this;
            var params = {};
            var alert = this.alert;
            
            alert.clear();
            this.loading(true);
            
            params.url = App.url('investments/apply-transactions.json');
            params.type = 'post';
            params.dataType = 'json';
            params.data = {json: JSON.stringify(this.collection.toJSON())};
            params.error = function (response) {
                alert.set('An unexpected error occured, please try again');
                self.loading(false);
            }
            params.success = function (response) {
                if (!response.success) {
                    alert.set(response.error);
                } else {
                    self.trigger('success', response);
                    self.close();
                }
                self.loading(false);
            }
            
            $.ajax(params);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$el.data('bs.modal')._config.backdrop = 'static';
            this.$submitIcon.removeClass('fa-upload');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$el.data('bs.modal')._config.backdrop = true;
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-upload');
        },
        
    });
    
    App.Investments.ApplyTransactionsSubmitModal = ApplyTransactionsSubmitModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var CreateForm = Investments.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,
        
        form: undefined,
        formId: 'investments-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investments-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Investments.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var Profile = Investments.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'investments-delete-profile',
        alertElement: 'investments-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Investments.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var Profile = Investments.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investments-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Investments.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var Modal = App.Modal;
    var UpdateForm = Investments.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,
        
        form: undefined,
        formId: 'investments-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investments-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Investments.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var Modal = App.Modal;
    var CreateForm = InvestorsAccounts.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investors-accounts-create-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById('investors-accounts-create-form')
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.InvestorsAccounts.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var Modal = App.Modal;
    var Profile = InvestorsAccounts.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        alertElement: 'investors-accounts-delete-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investors-accounts-delete-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                error: error,
                success: success,
            });
        },
        
    });
    
    App.InvestorsAccounts.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var Modal = App.Modal;
    var Profile = InvestorsAccounts.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investors-accounts-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.InvestorsAccounts.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var Modal = App.Modal;
    var UpdateForm = InvestorsAccounts.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investors-accounts-update-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById('investors-accounts-update-form')
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.InvestorsAccounts.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var Modal = App.Modal;
    var CreateForm = Investors.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'investors-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investors-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.trigger('cancel', this.model);
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Investors.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var Modal = App.Modal;
    var Profile = Investors.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'investors-delete-profile',
        alertElement: 'investors-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Investors.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var Modal = App.Modal;
    var Profile = Investors.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investors-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Investors.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var Modal = App.Modal;
    var UpdateForm = Investors.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'investors-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'investors-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Investors.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var Modal = App.Modal;
    var CreateForm = Offerings.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'offerings-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'offerings-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Offerings.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var Modal = App.Modal;
    var Profile = Offerings.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'offerings-delete-profile',
        alertElement: 'offerings-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Offerings.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var Modal = App.Modal;
    var Profile = Offerings.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        investmentsPanel: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initInvestments();
            this.initComments();
            this.initAttachments();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('offerings-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investments
         |----------------------------------------------------------------
         */
        
        initInvestments: function () {
            var Investments = App.Investments;
            var Collection = Investments.Collection;
            var investments = new Collection();
            var Panel = App.Offerings.InvestmentsPanel;
            var panel = new Panel({
                collection: investments,
                el: document.getElementById('offerings-investments-panel'),
            });
            this.investmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var Comments = App.Comments;
            var Collection = Comments.Collection;
            var comments = new Collection();
            var Panel = App.Offerings.CommentsPanel;
            var panel = new Panel({
                el: document.getElementById('offerings-comments-panel'),
                modal: this,
                collection: comments
            });
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var Attachments = App.Attachments;
            var Collection = Attachments.Collection;
            var attachments = new Collection();
            var Panel = App.Offerings.AttachmentsPanel;
            var panel = new Panel({
                el: document.getElementById('offerings-attachments-panel'),
                modal: this,
                collection: attachments
            });
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            $('#offerings-tab a:first').tab('show');
            this.investmentsPanel.reset(this.model);
            this.commentsPanel.reset(this.model);
            this.attachmentsPanel.reset(this.model);
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
        },
        
    });
    
    App.Offerings.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var Modal = App.Modal;
    var UpdateForm = Offerings.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'offerings-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'offerings-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Offerings.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var Modal = App.Modal;
    var CreateForm = Statements.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'statements-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'statements-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Statements.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var Modal = App.Modal;
    var Profile = Statements.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'statements-delete-profile',
        alertElement: 'statements-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Statements.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var Modal = App.Modal;
    var Profile = Statements.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('statements-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Statements.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Modal: Sync
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var Modal = App.Modal;
    
    var SyncModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
        },
        
    });
    
    App.Statements.SyncModal = SyncModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var Modal = App.Modal;
    var UpdateForm = Statements.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'statements-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'statements-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Statements.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var Modal = App.Modal;
    var CreateForm = Transactions.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        formId: 'transactions-create-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'transactions-create-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Transactions.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var Modal = App.Modal;
    var Profile = Transactions.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        profile: undefined,
        profileId: 'transactions-delete-profile',
        alertElement: 'transactions-delete-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.profileId) {
                this.profileId = options.profileId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById(this.profileId)
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                var message;
                if (options && options.textStatus) {
                    message = options.textStatus;
                } else {
                    message = 'An unexpected error occured';
                }
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                wait: true,
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Transactions.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var Modal = App.Modal;
    var Profile = Transactions.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('transactions-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Transactions.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var Modal = App.Modal;
    var UpdateForm = Transactions.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        formId: 'transactions-update-form',
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'transactions-update-modal-alert',
        closeOnSuccess: true,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            if (options.formId) {
                this.formId = options.formId;
            }
            if (options.closeOnSuccess !== undefined) {
                this.closeOnSuccess = options.closeOnSuccess;
            }
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById(this.formId)
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.trigger('cancel', this.model);
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            var closeOnSuccess = this.closeOnSuccess;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                if (closeOnSuccess) modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Transactions.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Modal: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var Modal = App.Modal;
    var CreateForm = Users.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateModal = Modal.extend({
        
        form: undefined,
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'users-create-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new CreateForm({
                el: document.getElementById('users-create-form')
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function (model) {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-plus');
        },
        
    });
    
    App.Users.CreateModal = CreateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Modal: Delete
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var Modal = App.Modal;
    var Profile = Users.DeleteProfile;
    
    var DeleteModal = Modal.extend({
        
        alertElement: 'users-delete-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('users-delete-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var model = this.model;
            this.alert.clear();
            
            function success (model) {
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                modal.loading(false);
                modal.alert.set(message);
            }
            
            this.loading(true);
            model.destroy({
                error: error,
                success: success,
            });
        },
        
    });
    
    App.Users.DeleteModal = DeleteModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Modal: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var Modal = App.Modal;
    var Profile = Users.ReadProfile;
    
    var ReadModal = Modal.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('users-read-profile')
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.profile.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="close"]': 'close',
            'click [data-action="update"]': 'update',
        },
        
        /*
         |----------------------------------------------------------------
         | Update
         |----------------------------------------------------------------
         */
        
        update: function () {
            this.close();
            this.trigger('update', this.model);
        },
        
    });
    
    App.Users.ReadModal = ReadModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\Modal: Update
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var Modal = App.Modal;
    var UpdateForm = Users.UpdateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var UpdateModal = Modal.extend({
        
        form: undefined,
        $submit: undefined,
        $cancel: undefined,
        $submitIcon: undefined,
        alertElement: 'users-update-modal-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $elem = this.$el;
            var $submit = $elem.find('[data-action="submit"]');
            var $cancel = $elem.find('[data-action="cancel"]');
            var $submitIcon = $submit.find('.fa');
            this.$submit = $submit;
            this.$cancel = $cancel;
            this.$submitIcon = $submitIcon;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new UpdateForm({
                el: document.getElementById('users-update-form')
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (model) {
            this.model = model;
            this.form.reset(model);
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="cancel"]': 'cancel',
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Cancel
         |----------------------------------------------------------------
         */
        
        cancel: function () {
            this.alert.clear();
            this.close();
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var modal = this;
            var form = this.form;
            
            this.alert.clear();
            
            function success (model) {
                events('off');
                modal.loading(false);
                modal.trigger('success', model);
                modal.close();
            }
            
            function error (message) {
                events('off');
                modal.loading(false);
                modal.alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('error', error);
                form[toggle]('success', success);
            }
            
            events('on');
            this.loading(true);
            this.form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-pencil-square-o');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-pencil-square-o');
        },
        
    });
    
    App.Users.UpdateModal = UpdateModal;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Accounts = App.Accounts;
    var View = Accounts.View;
    var Model = Accounts.Model;
    var Table = Accounts.Table;
    var Toolbar = Accounts.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Accounts.ReadModal;
    var CreateModal = Accounts.CreateModal;
    var UpdateModal = Accounts.UpdateModal;
    var DeleteModal = Accounts.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('accounts-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('accounts-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('accounts-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('accounts-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('accounts-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('accounts-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('accounts-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('accounts-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #accounts-table-toolbar [data-action="read"]'  : 'openReadModal',
            'click #accounts-table-toolbar [data-action="update"]': 'openUpdateModal',
            'click #accounts-table-toolbar [data-action="delete"]': 'openDeleteModal',
            'click #accounts-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('investor_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('accounts/export'),
                data: {
                    where: {
                        'investor_id': parentId
                    }
                },
                success: function (data) {
                    _.forceDownload(
                        data,
                        'investor-' + parentId + '-accounts.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Accounts.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Panel: Attachments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var AccountsAttachmentsPanel = View.extend({
        
        account: undefined,
        parent: 'Accounts',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.modal = options.modal;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Accounts.AttachmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('accounts-attachments-table'),
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                collection: this.collection,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.download();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Attachments.Toolbar({
                el: document.getElementById(
                    'accounts-attachments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'accounts-attachments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'accounts-attachments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var self = this;
            var modal = new App.Attachments.CreateModal({
                el: document.getElementById(
                    'accounts-attachments-create-modal'
                ),
                formId: 'accounts-attachments-create-form',
                alertElement: 'accounts-attachments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.account.set('attachments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var self = this;
            var modal = new App.Attachments.UpdateModal({
                el: document.getElementById(
                    'accounts-attachments-update-modal'
                ),
                formId: 'accounts-attachments-update-form',
                alertElement: 'accounts-attachments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.account.set('attachments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var self = this;
            var collection = this.collection;
            var modal = new App.Attachments.DeleteModal({
                el: document.getElementById(
                    'accounts-attachments-delete-modal'
                ),
                profileId: 'accounts-attachments-delete-profile',
                alertElement: 'accounts-attachments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.account.set('attachments', collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (account) {
            this.account = account;
            this.parentId = account.id;
            this.collection.reset(account.get('attachments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-attachments-table-toolbar > [data-action="download"]'  : 'download',
            'click #accounts-attachments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #accounts-attachments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #accounts-attachments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Download
         |----------------------------------------------------------------
         */
        
        download: function () {
            var model = this.table.selected;
            window.location = App.url('attachments/download/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new App.Attachments.Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
    });
    
    App.Accounts.AttachmentsPanel = AccountsAttachmentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Panel: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var AccountsCommentsPanel = View.extend({
        
        account: undefined,
        parent: 'Accounts',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.modal = options.modal;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Accounts.CommentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('accounts-comments-table'),
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                collection: this.collection,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openUpdateModal();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Comments.Toolbar({
                el: document.getElementById(
                    'accounts-comments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'accounts-comments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'accounts-comments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var self = this;
            var modal = new App.Comments.CreateModal({
                el: document.getElementById(
                    'accounts-comments-create-modal'
                ),
                formId: 'accounts-comments-create-form',
                alertElement: 'accounts-comments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.account.set('comments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var self = this;
            var modal = new App.Comments.UpdateModal({
                el: document.getElementById(
                    'accounts-comments-update-modal'
                ),
                formId: 'accounts-comments-update-form',
                alertElement: 'accounts-comments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.account.set('comments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var self = this;
            var collection = this.collection;
            var modal = new App.Comments.DeleteModal({
                el: document.getElementById(
                    'accounts-comments-delete-modal'
                ),
                profileId: 'accounts-comments-delete-profile',
                alertElement: 'accounts-comments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.account.set('comments', collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (account) {
            this.account = account;
            this.parentId = account.id;
            this.collection.reset(account.get('comments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-comments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #accounts-comments-table-toolbar > [data-action="read"]'  : 'openReadModal',
            'click #accounts-comments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #accounts-comments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new App.Comments.Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
    });
    
    App.Accounts.CommentsPanel = AccountsCommentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Panel: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var AccountsInvestmentsPanel = View.extend({
        
        account: undefined,
        parent: 'Accounts',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Accounts.InvestmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                el: document.getElementById('accounts-investments-table'),
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function () {
                self.read();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Investments.Toolbar({
                el: document.getElementById(
                    'accounts-investments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'accounts-investments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'accounts-investments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        reset: function (account) {
            this.account = account;
            this.parentId = account.id;
            this.collection.reset(account.get('investments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #accounts-investments-table-toolbar [data-action="read"]': 'read',
            'click #accounts-investments-table-toolbar [data-action="export"]': 'export'
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            if (!model) return;
            window.location = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('investments/export'),
                data: {
                    where: {
                        'account_id': parentId
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'account-' + parentId + '-investments.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Accounts.InvestmentsPanel = AccountsInvestmentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Table: Attachments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var AttachmentsTable = Table.extend({
        
        emptyMessage: 'No attachments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            mime: Table.formats.mime,
            size: Table.formats.size,
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Accounts.AttachmentsTable = AttachmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Table: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var CommentsTable = Table.extend({
        
        emptyMessage: 'No comments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Accounts.CommentsTable = CommentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\Table: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestmentsTable = Table.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Accounts.InvestmentsTable = InvestmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var View = Accounts.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Accounts.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var View = Accounts.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Accounts.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var View = Accounts.View;
    var Model = Accounts.Model;
    var Table = Accounts.Table;
    var Toolbar = Accounts.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Accounts.CreateModal;
    var UpdateModal = Accounts.UpdateModal;
    var DeleteModal = Accounts.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('accounts-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('accounts-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('accounts-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('accounts-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('accounts-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('accounts-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('accounts-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('accounts/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Accounts.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Accounts\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Accounts = App.Accounts;
    var View = Accounts.View;
    var Model = Accounts.Model;
    var Profile = Accounts.ReadProfile;
    var UpdateModal = Accounts.UpdateModal;
    var DeleteModal = Accounts.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('accounts-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Accounts',
                parentId: model.id,
                el: document.getElementById('accounts-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Accounts',
                parentId: model.id,
                el: document.getElementById('accounts-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('accounts-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('accounts-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Accounts.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Attachments = App.Attachments;
    var View = Attachments.View;
    var Model = Attachments.Model;
    var Table = Attachments.Table;
    var Toolbar = Attachments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Attachments.ReadModal;
    var CreateModal = Attachments.CreateModal;
    var UpdateModal = Attachments.UpdateModal;
    var DeleteModal = Attachments.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('attachments-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('attachments-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('attachments-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('attachments-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('attachments-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('attachments-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('attachments-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="download"]': 'download',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Download
         |----------------------------------------------------------------
         */
        
        download: function () {
            var model = this.table.selected;
            window.location = App.url('attachments/download/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Attachments.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var View = Attachments.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Attachments.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var View = Attachments.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Attachments.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var View = Attachments.View;
    var Model = Attachments.Model;
    var Table = Attachments.Table;
    var Toolbar = Attachments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Attachments.CreateModal;
    var UpdateModal = Attachments.UpdateModal;
    var DeleteModal = Attachments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('attachments-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('attachments-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('attachments-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('attachments-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('attachments-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('attachments-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('attachments-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('attachments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Attachments.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Attachments\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Attachments = App.Attachments;
    var View = Attachments.View;
    var Model = Attachments.Model;
    var Profile = Attachments.ReadProfile;
    var UpdateModal = Attachments.UpdateModal;
    var DeleteModal = Attachments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('attachments-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Attachments',
                parentId: model.id,
                el: document.getElementById('attachments-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Attachments',
                parentId: model.id,
                el: document.getElementById('attachments-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('attachments-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('attachments-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Attachments.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Comments = App.Comments;
    var View = Comments.View;
    var Model = Comments.Model;
    var Table = Comments.Table;
    var Toolbar = Comments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Comments.ReadModal;
    var CreateModal = Comments.CreateModal;
    var UpdateModal = Comments.UpdateModal;
    var DeleteModal = Comments.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('comments-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('comments-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('comments-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('comments-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('comments-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('comments-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('comments-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('comments-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Comments.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var View = Comments.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Comments.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var View = Comments.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Comments.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var View = Comments.View;
    var Model = Comments.Model;
    var Table = Comments.Table;
    var Toolbar = Comments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Comments.CreateModal;
    var UpdateModal = Comments.UpdateModal;
    var DeleteModal = Comments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('comments-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('comments-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('comments-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('comments-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('comments-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('comments-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('comments-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('comments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Comments.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Comments\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Comments = App.Comments;
    var View = Comments.View;
    var Model = Comments.Model;
    var Profile = Comments.ReadProfile;
    var UpdateModal = Comments.UpdateModal;
    var DeleteModal = Comments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('comments-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Comments',
                parentId: model.id,
                el: document.getElementById('comments-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Comments',
                parentId: model.id,
                el: document.getElementById('comments-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('comments-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('comments-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Comments.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Funds = App.Funds;
    var View = Funds.View;
    var Model = Funds.Model;
    var Table = Funds.Table;
    var Toolbar = Funds.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Funds.ReadModal;
    var CreateModal = Funds.CreateModal;
    var UpdateModal = Funds.UpdateModal;
    var DeleteModal = Funds.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('funds-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('funds-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('funds-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('funds-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('funds-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('funds-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('funds-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('funds-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Funds.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Panel: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var FundsInvestmentsPanel = View.extend({
        
        fund: undefined,
        parent: 'Funds',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.fund = options.fund;
            this.parentId = this.fund.id;
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Funds.InvestmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                el: document.getElementById('funds-investments-table'),
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function () {
                self.read();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Investments.Toolbar({
                el: document.getElementById(
                    'funds-investments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'funds-investments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'funds-investments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        reset: function (fund) {
            this.fund = fund;
            this.parentId = fund.id;
            this.collection.reset(fund.get('investments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #funds-investments-table-toolbar [data-action="read"]': 'read',
            'click #funds-investments-table-toolbar [data-action="export"]': 'export'
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            if (!model) return;
            window.location = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var fund = this.fund;
            var fundId = fund.id;
            $.ajax({
                url: App.url('investments/export'),
                data: {
                    where: {
                        'offering_id IN': _.pluck(fund.get('offerings'), 'id')
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'fund-' + fundId + '-investments.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Funds.InvestmentsPanel = FundsInvestmentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\Table: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var statusTypes = [
        'Pending',
        'Open',
        'Closed'
    ];
    
    var InvestmentsTable = Table.extend({
        
        emptyMessage: 'No investments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            status: function (value) {
                value || (value = 1);
                return statusTypes[value];
            },
            rate: function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            date: Table.formats.date,
            amount: Table.formats.currency,
            balance: Table.formats.currency,
        }
        
    });
    
    App.Funds.InvestmentsTable = InvestmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var View = Funds.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Funds.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var View = Funds.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Funds.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var View = Funds.View;
    var Model = Funds.Model;
    var Table = Funds.Table;
    var Toolbar = Funds.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Funds.CreateModal;
    var UpdateModal = Funds.UpdateModal;
    var DeleteModal = Funds.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('funds-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                sortField: 'investments_balance',
                sortOrder: 'desc',
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('funds-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('funds-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('funds-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('funds-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('funds-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('funds-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
            'click [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('funds/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            $.ajax({
                url: App.url('funds/export'),
                success: function (content) {
                    _.forceDownload(
                        content,
                        'funds.csv',
                        'text/csv;encoding:utf-8'
                    );
                },
            });
        },
        
    });
    
    App.Funds.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Funds\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Funds = App.Funds;
    var View = Funds.View;
    var Model = Funds.Model;
    var Profile = Funds.ReadProfile;
    var UpdateModal = Funds.UpdateModal;
    var DeleteModal = Funds.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        offeringsPanel: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initOfferings();
            this.initInvestments();
            this.initComments();
            this.initAttachments();
            this.initModals();
            
            // Bug fix: Tab not hiding previous panel(s), seems to be
            // isolated to this views with nested tabs
            $('#funds-tab').on('shown.bs.tab', function (e) {
                $(e.relatedTarget.getAttribute('href'))
                    .removeClass('active')
                    .removeClass('show');
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('funds-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize offerings
         |----------------------------------------------------------------
         */
        
        initOfferings: function () {
            var model = this.model;
            var Offerings = App.Offerings;
            var Panel = Offerings.Panel;
            var Collection = Offerings.Collection;
            var offerings = new Collection(model.get('offerings'));
            
            var panel = new Panel({
                fund: model,
                collection: offerings,
                el: document.getElementById('funds-offerings-panel'),
            });
            
            this.offeringsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investments
         |----------------------------------------------------------------
         */
        
        initInvestments: function () {
            var model = this.model;
            var Panel = Funds.InvestmentsPanel;
            var Collection = App.Investments.Collection;
            var investments = new Collection(model.get('investments'));
            
            var panel = new Panel({
                fund: model,
                collection: investments,
                el: document.getElementById('funds-investments-panel'),
            });
            
            this.investmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Funds',
                parentId: model.id,
                el: document.getElementById('funds-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Funds',
                parentId: model.id,
                el: document.getElementById('funds-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('funds-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('funds-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.offeringsPanel.render();
            this.investmentsPanel.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Funds.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Investments = App.Investments;
    var View = Investments.View;
    var Model = Investments.Model;
    var Table = Investments.Table;
    var Toolbar = Investments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Investments.ReadModal;
    var CreateModal = Investments.CreateModal;
    var UpdateModal = Investments.UpdateModal;
    var DeleteModal = Investments.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('offerings-investments-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('investments-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('investments-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('investments-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investments-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('investments-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investments-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investments-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Investments.Panel = Panel;
     
}(App));

/*
 |-----------------------------------------------------------------------------
 | App\Investments\View: Apply transactions
 |-----------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;

    /*
     |-------------------------------------------------------------------------
     | Constructor
     |-------------------------------------------------------------------------
     */
    
    var ApplyTransactionsView = View.extend({
        
        date: undefined,
        ready: false,
        error: false,
        investments: undefined,
        accounts: undefined,
        investors: undefined,
        transactions: undefined,
        offerings: undefined,
        funds: undefined,
        deletedTransactions: undefined,
        
        /*
         |---------------------------------------------------------------------
         | Initialize
         |---------------------------------------------------------------------
         */
        
        initialize: function (options) {
            var self = this;
            this.date = options.date;
            this.once('ready', function () {
                if (self.transactions.length == 0) {
                    return self._upToDate();
                }
                self.initTable();
                self.initModals();
                self.render();
            });
            this.initElement();
            this.loading(true);
            this.initInvestments();
            this.initAccounts();
            this.initInvestors();
            this.initTransactions();
            this.initFunds();
            this.initOfferings();
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize element
         |---------------------------------------------------------------------
         */
        
        initElement: function () {
            var $table = $('#transactions-table');
            var $toolbar = $('#transactions-table-toolbar');
            this.$table = $table;
            this.$tbody = $table.find('tbody');
            this.$toolbar = $toolbar;
            this.$create = $toolbar.find('[data-action="create"]');
            this.$export = $toolbar.find('[data-action="export"]');
            this.$import = $toolbar.find('[data-action="import"]');
            this.$undoUpdate = $toolbar.find('[data-action="undo-update"]');
            this.$undoDelete = $toolbar.find('[data-action="undo-delete"]');
            this.$recalc = $toolbar.find('[data-action="recalculate"]');
            this.$searchbox = $('#transactions-table-searchbox');
            this.$pagination = $('#transactions-table-pagination');
            this.$form = $('#transactions-table-form');
            this.$error = $('#error-message');
            this.$loading = $('#loading-message');
            this.$success = $('#success-message');
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize investments
         |---------------------------------------------------------------------
         */
        
        initInvestments: function () {
            var self = this;
            var Collection = App.Investments.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.investments = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize accounts
         |---------------------------------------------------------------------
         */
        
        initAccounts: function () {
            var self = this;
            var Collection = App.Accounts.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.accounts = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize investors
         |---------------------------------------------------------------------
         */
        
        initInvestors: function () {
            var self = this;
            var Collection = App.Investors.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.investors = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize transactions
         |---------------------------------------------------------------------
         */
        
        initTransactions: function () {
            var self = this;
            var Collection = App.Transactions.Collection;
            var updated = new App.Collection();
            var deleted = new App.Collection();
            var collection = new Collection();
            
            updated.comparator = '__update_timestamp';
            deleted.comparator = '__delete_timestamp';
            
            collection.on('change', function (model) {
                if (!_.isModel(model)) return;
                if (model.get('__delete_timestamp')) {
                    return;
                }
                if (model.get('__is_undo')) {
                    model.unset('__is_undo', { silent: true });
                    collection.trigger('update');
                    return true;
                }
                var model_ = new App.Model({
                    previous: model.previousAttributes(),
                    __cid: model.cid,
                    __update_timestamp: new Date
                });
                self.$undoUpdate.prop('disabled', false);
                updated.add(model_);
            });
            
            collection.on('remove', function (model) {
                model.set('__delete_timestamp', new Date);
                self.$undoDelete.prop('disabled', false);
                deleted.add(model);
            });
            
            updated.on('remove', function (model_) {
                var cid = model_.get('__cid');
                var attrs = model_.get('previous');
                var model = collection.get(cid);
                attrs.__is_undo = true;
                model.set(attrs);
                if (updated.length == 0) {
                    self.$undoUpdate.prop('disabled', true);
                }
            });
            
            deleted.on('remove', function (model) {
                model.unset('__delete_timestamp');
                collection.add(model);
                if (deleted.length == 0) {
                    self.$undoDelete.prop('disabled', true);
                }
            });
            
            var date = moment(this.date).format('YYYY-MM-DD');
            var settings = {
                url: App.url('investments/calculate-transactions/' + date + '.json'),
                success: function (transactions) {
                    collection.reset(transactions);
                    self.deleted = deleted;
                    self.updated = updated;
                    self.transactions = collection;
                    self._ready();
                }
            };
            
            $.ajax(settings);
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize funds
         |---------------------------------------------------------------------
         */
        
        initFunds: function () {
            var self = this;
            var Collection = App.Funds.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.funds = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize offerings
         |---------------------------------------------------------------------
         */
        
        initOfferings: function () {
            var self = this;
            var Collection = App.Offerings.Collection;
            var collection = new Collection();
            collection.fetch({
                success: function () {
                    self.offerings = collection;
                    self._ready();
                }
            });
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize table
         |---------------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var $undo = this.$undo;
            var deleted = this.deletedTransactions;
            var collection = this.transactions;
            var Table = App.Transactions.Table;
            var table = new Table({
                collection: collection,
                toolbar: this.initToolbar(),
                searchbox: this.initSearchbox(),
                pagination: this.initPagination(),
                selectable: false,
                sortField: 'client_id',
                sortOrder: 'desc',
                formats: {
                    delete: function () {
                        var model = this;
                        var link = document.createElement('a');
                        var icon = document.createElement('span');
                        icon.className = 'text-danger fa fa-trash';
                        link.href = '#';
                        link.appendChild(icon);
                        $(link).on('click', function () {
                            collection.remove(model);
                        });
                        return link;
                    },
                    date: function (date) {
                        var model = this;
                        var input = document.createElement('input');
                        input.className = 'form-control';
                        input.type = 'date';
                        input.value = date;
                        $(input).on('change', function () {
                            model.set('date', this.value);
                        });
                        return input;
                    },
                    type: function (type) {
                        var model = this;
                        var select = document.createElement('select');
                        var option1 = document.createElement('option');
                        var option2 = document.createElement('option');
                        var option3 = document.createElement('option');
                        option1.innerHTML = 'Preferred payment (prorated)';
                        option1.value = 1;
                        if (type == 1) {
                            option1.selected = true;
                        }
                        option2.innerHTML = 'Preferred payment';
                        option2.value = 2;
                        if (type == 2) {
                            option2.selected = true;
                        }
                        option3.innerHTML = 'Drawdown';
                        option3.value = 3;
                        if (type == 3) {
                            option3.selected = true;
                        }
                        select.className = 'form-control';
                        select.appendChild(option1);
                        select.appendChild(option2);
                        select.appendChild(option3);
                        $(select).on('change', function () {
                            model.set('type', $(this).val());
                        });
                        return select;
                    },
                    amount: function (amount) {
                        var model = this;
                        var input = document.createElement('input');
                        input.className = 'form-control';
                        input.type = 'number';
                        input.value = parseFloat(amount).toFixed(2);
                        $(input).on('change', function () {
                            model.set('amount', this.value);
                        });
                        return input;
                    },
                    add: function () {
                        var model = this.clone();
                        var link = document.createElement('a');
                        var icon = document.createElement('span');
                        icon.className = 'text-success fa fa-plus';
                        link.href = '#';
                        link.appendChild(icon);
                        $(link).on('click', function () {
                            self.openCreateModal(model);
                        });
                        return link;
                    },
                },
                el: this.$table[0],
            });
            this.table = table;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize toolbar
         |---------------------------------------------------------------------
         */
        
        initToolbar: function () {
            var element = this.$toolbar[0];
            var Toolbar = App.Transactions.Toolbar;
            var toolbar = new Toolbar({el: element});
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize searchbox
         |---------------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var element = this.$searchbox[0];
            var searchbox = new Searchbox({el: element});
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize pagination
         |---------------------------------------------------------------------
         */
        
        initPagination: function () {
            var element = this.$pagination[0];
            var pagination = new Pagination({el: element});
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize modals
         |---------------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initImportModal();
            this.initSubmitModal();
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize create modal
         |---------------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var transactions = this.transactions;
            var Modal = App.Investments.ApplyTransactionsAddModal;
            var modal = new Modal({
                investors: this.investors,
                accounts: this.accounts,
                investments: this.investments,
                el: document.getElementById('apply-transactions-add-modal')
            });
            modal.on('success', function (model) {
                transactions.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize create modal
         |---------------------------------------------------------------------
         */
        
        initImportModal: function () {
            var self = this;
            var accounts = self.accounts;
            var investors = self.investors;
            var investments = self.investments;
            var transactions = self.transactions;
            var offerings, funds;
            var investment, account, investor, offering, fund;
            var Modal = App.Investments.ApplyTransactionsImportModal;
            var modal = new Modal({
                el: document.getElementById('apply-transactions-import-modal')
            });
            modal.on('success', function (records) {
                funds = self.funds;
                offerings = self.offerings;
                transactions.reset(records);
                transactions.each(function (model) {
                    investment = investments.get(model.get('investment_id'));
                    account = accounts.get(investment.get('account_id'));
                    offering = offerings.get(investment.get('offering_id'));
                    investor = investors.get(account.get('investor_id'));
                    fund = funds.get(offering.get('fund_id'));
                    model.set('client_id', investment.get('client_id'));
                    model.set('investment_amount', investment.get('amount'));
                    model.set('investment_date', investment.get('date'));
                    model.set('investment_term', investment.get('term'));
                    model.set('investment_balance', investment.get('balance'));
                    model.set('investment_rate', offering.get('rate'));
                    model.set('fund_name', fund.get('name'));
                    model.set('investor_name', investor.get('name'));
                    model.set('account_name', account.get('name'));
                });
                transactions.trigger('update');
            });
            this.importModal = modal;
        },
        
        /*
         |---------------------------------------------------------------------
         | Initialize submit modal
         |---------------------------------------------------------------------
         */
        
        initSubmitModal: function () {
            var Modal = App.Investments.ApplyTransactionsSubmitModal;
            var modal = new Modal({
                el: document.getElementById('apply-transactions-submit-modal')
            });
            modal.on('success', function (model) {
                
            });
            this.submitModal = modal;
        },
        
        /*
         |---------------------------------------------------------------------
         | Render
         |---------------------------------------------------------------------
         */
        
        render: function () {
            if (!this.ready) return;
            this.table.render();
            this.createModal.render();
            this.importModal.render();
            this.submitModal.render();
        },
        
        /*
         |---------------------------------------------------------------------
         | Events
         |---------------------------------------------------------------------
         */
        
        events: {
            'click #transactions-table-form [data-action="submit"]': 'openSubmitModal',
            'click #transactions-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #transactions-table-toolbar [data-action="export"]': 'export',
            'click #transactions-table-toolbar [data-action="import"]': 'openImportModal',
            'click #transactions-table-toolbar [data-action="undo-update"]': 'undoUpdate',
            'click #transactions-table-toolbar [data-action="undo-delete"]': 'undoDelete',
            'click #transactions-table-toolbar [data-action="recalculate"]': 'recalculate',
        },
        
        /*
         |---------------------------------------------------------------------
         | Open submit modal
         |---------------------------------------------------------------------
         */
        
        openSubmitModal: function (model) {
            var collection = this.transactions;
            var modal = this.submitModal;
            modal.reset(collection);
            modal.open();
        },
        
        /*
         |---------------------------------------------------------------------
         | Open create modal
         |---------------------------------------------------------------------
         */
        
        openCreateModal: function (model) {
            var Model = App.Transactions.Model;
            var investment, accout, investor;
            if (!_.isModel(model)) {
                model = new Model({date: new Date()});
            } else {
                investment = this.investments.get(model.get('investment_id'));
                account = this.accounts.get(investment.get('account_id'));
                investor = this.investors.get(account.get('investor_id'));
            }
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
            if (investor) {
                modal.updateInvestor(investor);
                modal.updateAccount(account);
                modal.updateInvestment(investment);
            }
        },
        
        /*
         |---------------------------------------------------------------------
         | Export
         |---------------------------------------------------------------------
         */
        
        export: function () {
            var content = [];
            var filename = 'transactions.csv';
            var filetype = 'text/csv;encoding:utf-8';
            
            // Header row
            content.push(_.formatCsvRow([
                /* 0  */ 'investment_id',
                /* 1  */ 'date',
                /* 2  */ 'type',
                /* 3  */ 'amount',
                /* 4  */ 'description',
                /* 5  */ 'client_id',
                /* 6  */ 'investment_amount',
                /* 7  */ 'investment_date',
                /* 8  */ 'investment_term',
                /* 9  */ 'investment_balance',
                /* 10 */ 'investment_rate',
                /* 11 */ 'fund_name',
                /* 12 */ 'investor_name',
                /* 13 */ 'account_name'
            ]));
            
            // Add body rows
            this.transactions.each(function (model) {
                var type = model.get('type');
                content.push(_.formatCsvRow([
                    /* 0  */ model.get('investment_id'),
                    /* 1  */ model.get('date'),
                    /* 2  */ type,
                    /* 3  */ parseFloat(model.get('amount')).toFixed(2),
                    /* 4  */ App.Transactions.typeDescription(type),
                    /* 5  */ model.get('client_id'),
                    /* 6  */ model.get('investment_amount'),
                    /* 7  */ moment(model.get('investment_date')).format('MM/DD/YYYY'),
                    /* 8  */ model.get('investment_term'),
                    /* 9  */ model.get('investment_balance'),
                    /* 10 */ (model.get('investment_rate') / 100).toFixed(3),
                    /* 11 */ model.get('fund_name'),
                    /* 12 */ model.get('investor_name'),
                    /* 13 */ model.get('account_name'),
                ]));
            });
            
            // Download content
            _.forceDownload(content.join('\n'), filename, filetype);
        },
        
        /*
         |---------------------------------------------------------------------
         | Open import modal
         |---------------------------------------------------------------------
         */
        
        openImportModal: function (model) {
            var modal = this.importModal;
            modal.open();
        },
        
        /*
         |---------------------------------------------------------------------
         | Undo update
         |---------------------------------------------------------------------
         */
        
        undoUpdate: function () {
            var updated = this.updated;
            updated.models.reverse();
            updated.shift();
            updated.models.reverse();
        },
        
        /*
         |---------------------------------------------------------------------
         | Undo delete
         |---------------------------------------------------------------------
         */
        
        undoDelete: function () {
            var deleted = this.deleted;
            deleted.models.reverse();
            deleted.shift();
            deleted.models.reverse();
        },
        
        /*
         |---------------------------------------------------------------------
         | Recalculate
         |---------------------------------------------------------------------
         */
        
        recalculate: function () {
            $input = this.$toolbar.find('[data-action="effective-date"]');
            window.location = App.url('investments/apply-transactions/' + moment($input.val()).format('YYYY-MM-DD'));
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state on
         |---------------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$tbody.addClass('d-none');
            this.$pagination.addClass('d-none');
            this.$form.addClass('d-none');
            this.$error.addClass('d-none');
            this.$loading.removeClass('d-none');
            this.$create.prop('disabled', true);
            this.$export.prop('disabled', true);
            this.$import.prop('disabled', true);
            this.$recalc.prop('disabled', true);
        },
        
        /*
         |---------------------------------------------------------------------
         | Loading state off
         |---------------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            if (!this.error) {
                this.$tbody.removeClass('d-none');
                this.$pagination.removeClass('d-none');
                this.$form.removeClass('d-none');
                this.$create.prop('disabled', false);
                this.$export.prop('disabled', false);
                this.$import.prop('disabled', false);
                this.$recalc.prop('disabled', false);
            }
            this.$loading.addClass('d-none');
        },
        
        /*
         |---------------------------------------------------------------------
         | Ready
         |---------------------------------------------------------------------
         */
        
        _ready: function () {
            if (this.funds &&
                this.accounts &&
                this.investors &&
                this.offerings &&
                this.investments &&
                this.transactions) {
                this.ready = true;
                this.loading(false);
                this.trigger('ready');
            }
        },
        
        /*
         |---------------------------------------------------------------------
         | Up to date
         |---------------------------------------------------------------------
         */
        
        _upToDate: function () {
            this.$tbody.addClass('d-none');
            this.$pagination.addClass('d-none');
            this.$form.addClass('d-none');
            this.$error.addClass('d-none');
            this.$loading.removeClass('d-none');
            this.$create.prop('disabled', true);
            this.$export.prop('disabled', true);
            this.$import.prop('disabled', true);
            this.$loading.addClass('d-none');
            this.$success.removeClass('d-none');
        },
        
        /*
         |---------------------------------------------------------------------
         | Download
         |---------------------------------------------------------------------
         */
        
        download: function () {
            
            var format = this.csvRow;
            var collection = this.collection;
            var csv = [format([
                'id',
                'date',
                'amount',
                'account',
                'investor'
            ])];
            
            collection.each(function (model) {
                var row = [];
                var account = model.get('account');
                var investors = account.investors;
                var investor = [];
                _.each(investors, function (item) {
                    investor.push(item.name);
                });
                investor = investor.join(',');
                
                row.push(model.get('id'));
                row.push(model.get('date'));
                row.push(model.get('amount'));
                row.push(account.name);
                row.push(investor);
                
                csv.push(format(row));
            });
            
            var a = document.createElement('a');
            var content = csv.join('\n');
            var filename = 'transactions-to-apply.csv';
            a.href = URL.createObjectURL(new Blob([content], {
                type: 'text/csv;encoding:utf-8'
            }));
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        
        csvRow: function (data) {
            var csv = [];
            _.each(data, function (value) {
                if (value.toString().indexOf(',') >= 0) {
                    value = '"' + value + '"';
                }
                csv.push(value);
            });
            return csv.join(',');
        }
        
    });
    
    App.Investments.views.ApplyTransactions = ApplyTransactionsView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Investments.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Investments.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;
    var Model = Investments.Model;
    var Table = Investments.Table;
    var Toolbar = Investments.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Investments.CreateModal;
    var UpdateModal = Investments.UpdateModal;
    var DeleteModal = Investments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,
        
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('investments-table'),
                sortField: 'date',
                sortOrder: 'desc',
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('investments-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('investments-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('investments-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investments-create-modal'),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investments-update-modal'),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investments-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
            'click [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model({
                date: new Date()
            });
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            $.ajax({
                url: App.url('investments/export'),
                success: function (content) {
                    _.forceDownload(
                        content,
                        'investments.csv',
                        'text/csv;encoding:utf-8'
                    );
                },
            });
        },
        
    });
    
    App.Investments.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investments\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investments = App.Investments;
    var View = Investments.View;
    var Model = Investments.Model;
    var Profile = Investments.ReadProfile;
    var UpdateModal = Investments.UpdateModal;
    var DeleteModal = Investments.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        funds: undefined,
        accounts: undefined,
        offerings: undefined,
        investors: undefined,
        
        profile: undefined,
        transactionsPanel: undefined,
        statementsPanel: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.funds = options.funds;
            this.accounts = options.accounts;
            this.offerings = options.offerings;
            this.investors = options.investors;
            this.initProfile();
            this.initTransactions();
            this.initStatements();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investments-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize transactions
         |----------------------------------------------------------------
         */
        
        initTransactions: function () {
            var self = this;
            var model = this.model;
            var Transactions = App.Transactions;
            var Panel = Transactions.Panel;
            var Collection = Transactions.Collection;
            var transactions = new Collection(model.get('transactions'));
            
            var panel = new Panel({
                parent: 'Investments',
                parentId: model.id,
                el: document.getElementById('investments-transactions-panel'),
                investment: model,
                collection: transactions,
            });
            
            panel.on('update', function () {
                model.fetch({
                    success: function () {
                        self.profile.render();
                    }
                });
            });
            
            this.transactionsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize statements
         |----------------------------------------------------------------
         */
        
        initStatements: function () {
            var model = this.model;
            var Statements = App.Statements;
            var Panel = Statements.Panel;
            var Collection = Statements.Collection;
            var statements = new Collection(model.get('statements'));
            
            var panel = new Panel({
                parent: 'Investments',
                parentId: model.id,
                el: document.getElementById('investments-statements-panel'),
                collection: statements,
            });
            
            this.statementsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Investments',
                parentId: model.id,
                el: document.getElementById('investments-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Investments',
                parentId: model.id,
                el: document.getElementById('investments-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var self = this;
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('investments-update-modal'),
                funds: this.funds,
                accounts: this.accounts,
                offerings: this.offerings,
                investors: this.investors,
            });
            modal.on('success', function () {
                var transactions = self.transactionsPanel.collection;
                profile.render();
                transactions.reset(self.model.get('transactions'));
                transactions.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('investments-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.transactionsPanel.render();
            this.statementsPanel.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Investments.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var InvestorsAccounts = App.InvestorsAccounts;
    var View = InvestorsAccounts.View;
    var Model = InvestorsAccounts.Model;
    var Table = InvestorsAccounts.Table;
    var Toolbar = InvestorsAccounts.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = InvestorsAccounts.ReadModal;
    var CreateModal = InvestorsAccounts.CreateModal;
    var UpdateModal = InvestorsAccounts.UpdateModal;
    var DeleteModal = InvestorsAccounts.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('investors-accounts-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('investors-accounts-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('investors-accounts-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('investors-accounts-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investors-accounts-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('investors-accounts-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investors-accounts-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investors-accounts-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.InvestorsAccounts.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var View = InvestorsAccounts.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.InvestorsAccounts.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var View = InvestorsAccounts.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.InvestorsAccounts.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var View = InvestorsAccounts.View;
    var Model = InvestorsAccounts.Model;
    var Table = InvestorsAccounts.Table;
    var Toolbar = InvestorsAccounts.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = InvestorsAccounts.CreateModal;
    var UpdateModal = InvestorsAccounts.UpdateModal;
    var DeleteModal = InvestorsAccounts.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('investors-accounts-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('investors-accounts-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('investors-accounts-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('investors-accounts-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investors-accounts-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investors-accounts-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investors-accounts-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('investors-accounts/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.InvestorsAccounts.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\InvestorsAccounts\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var InvestorsAccounts = App.InvestorsAccounts;
    var View = InvestorsAccounts.View;
    var Model = InvestorsAccounts.Model;
    var Profile = InvestorsAccounts.ReadProfile;
    var UpdateModal = InvestorsAccounts.UpdateModal;
    var DeleteModal = InvestorsAccounts.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investors-accounts-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'InvestorsAccounts',
                parentId: model.id,
                el: document.getElementById('investors-accounts-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'InvestorsAccounts',
                parentId: model.id,
                el: document.getElementById('investors-accounts-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('investors-accounts-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('investors-accounts-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.InvestorsAccounts.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Investors = App.Investors;
    var View = Investors.View;
    var Model = Investors.Model;
    var Table = Investors.Table;
    var Toolbar = Investors.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Investors.ReadModal;
    var CreateModal = Investors.CreateModal;
    var UpdateModal = Investors.UpdateModal;
    var DeleteModal = Investors.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('investors-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('investors-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('investors-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('investors-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investors-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('investors-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investors-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investors-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Investors.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Panel: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var InvestorsInvestmentsPanel = View.extend({
        
        parent: 'Investors',
        investor: undefined,
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.investor = options.investor;
            this.parentId = this.investor.id;
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Investors.InvestmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                el: document.getElementById('investors-investments-table'),
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function () {
                self.read();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Investments.Toolbar({
                el: document.getElementById(
                    'investors-investments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'investors-investments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'investors-investments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        reset: function (investor) {
            this.investor = investor;
            this.collection.reset(investor.get('investments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #investors-investments-table-toolbar [data-action="read"]': 'read',
            'click #investors-investments-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            if (!model) return;
            window.location = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var investor = this.investor;
            var investorId = investor.id;
            $.ajax({
                url: App.url('investments/export'),
                data: {
                    where: {
                        'account_id IN': _.pluck(investor.get('accounts'), 'id')
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'investor-' + investorId + '-investments.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Investors.InvestmentsPanel = InvestorsInvestmentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Panel: Statements
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var InvestorsStatementsPanel = View.extend({
        
        investor: undefined,
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var Table = App.Investors.StatementsTable;
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('investors-statements-table'),
                collection: this.collection,
                searchbox: searchbox,
                pagination: pagination
            });
            
            table.on('dblclick', function (model) {
                window.open(App.url('statements/view/' + model.id), '_blank').focus();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'investors-statements-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'investors-statements-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        reset: function (investor) {
            this.investor = investor;
            this.collection.reset(investor.get('statements'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Investors.StatementsPanel = InvestorsStatementsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Table: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var statusTypes = [
        'Pending',
        'Open',
        'Closed'
    ];
    
    var InvestmentsTable = Table.extend({
        
        emptyMessage: 'No investments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            status: function (value) {
                value || (value = 1);
                return statusTypes[value];
            },
            'offering.rate': function (value) {
                value || (value = 0);
                return value.toFixed(3) + '%';
            },
            date: Table.formats.date,
            amount: Table.formats.currency,
            balance: Table.formats.currency,
        }
        
    });
    
    App.Investors.InvestmentsTable = InvestmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\Table: Statements
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var StatementsTable = Table.extend({
        
        emptyMessage: 'No statements found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            type: function () {
                var span = document.createElement('span');
                span.className = 'fa fa-file-pdf-o';
                return span;
            },
            size: Table.formats.size
        }
        
    });
    
    App.Investors.StatementsTable = StatementsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var View = Investors.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Investors.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var View = Investors.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Investors.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var View = Investors.View;
    var Model = Investors.Model;
    var Table = Investors.Table;
    var Toolbar = Investors.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Investors.CreateModal;
    var UpdateModal = Investors.UpdateModal;
    var DeleteModal = Investors.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('investors-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('investors-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('investors-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('investors-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('investors-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('investors-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('investors-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
            'click [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('investors/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            $.ajax({
                url: App.url('investors/export'),
                success: function (content) {
                    _.forceDownload(
                        content,
                        'investors.csv',
                        'text/csv;encoding:utf-8'
                    );
                },
            });
        },
        
    });
    
    App.Investors.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\View: Missing FTP folders
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var View = Investors.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var MissingFtpFoldersView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="submit"]': 'submit'
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        submit: function () {
            
        },
        
    });
    
    App.Investors.views.MissingFtpFolders = MissingFtpFoldersView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Investors\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Investors = App.Investors;
    var View = Investors.View;
    var Model = Investors.Model;
    var Profile = Investors.ReadProfile;
    var UpdateModal = Investors.UpdateModal;
    var DeleteModal = Investors.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        accountsPanel: undefined,
        investmentsPanel: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initAccounts();
            this.initInvestments();
            this.initStatements();
            this.initComments();
            this.initAttachments();
            this.initModals();
            
            // Bug fix: Tab not hiding previous panel(s), seems to be
            // isolated to this views with nested tabs
            $('#investors-tab').on('shown.bs.tab', function (e) {
                $(e.relatedTarget.getAttribute('href'))
                    .removeClass('active')
                    .removeClass('show');
            });
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('investors-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize accounts
         |----------------------------------------------------------------
         */
        
        initAccounts: function () {
            var model = this.model;
            var Accounts = App.Accounts;
            var Panel = Accounts.Panel;
            var Collection = Accounts.Collection;
            var accounts = new Collection(model.get('accounts'));
            
            var panel = new Panel({
                parent: 'Investors',
                parentId: model.id,
                el: document.getElementById('investors-accounts-panel'),
                collection: accounts
            });
            
            this.accountsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize investments
         |----------------------------------------------------------------
         */
        
        initInvestments: function () {
            var model = this.model;
            var Panel = Investors.InvestmentsPanel;
            var Collection = App.Investments.Collection;
            var investments = new Collection(model.get('investments'));
            
            var panel = new Panel({
                investor: model,
                collection: investments,
                el: document.getElementById('investors-investments-panel'),
            });
            
            this.investmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize statements
         |----------------------------------------------------------------
         */
        
        initStatements: function () {
            var model = this.model;
            var Panel = Investors.StatementsPanel;
            var Collection = App.Statements.Collection;
            var statements = new Collection(model.get('statements'));
            
            var panel = new Panel({
                parent: 'Investors',
                parentId: model.id,
                el: document.getElementById('investors-statements-panel'),
                collection: statements
            });
            
            this.statementsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Investors',
                parentId: model.id,
                el: document.getElementById('investors-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Investors',
                parentId: model.id,
                el: document.getElementById('investors-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('investors-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('investors-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.accountsPanel.render();
            this.investmentsPanel.render();
            this.statementsPanel.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Investors.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Offerings = App.Offerings;
    var View = Offerings.View;
    var Model = Offerings.Model;
    var Table = Offerings.Table;
    var Toolbar = Offerings.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Offerings.ReadModal;
    var CreateModal = Offerings.CreateModal;
    var UpdateModal = Offerings.UpdateModal;
    var DeleteModal = Offerings.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        fund: undefined,
        parent: 'Funds',
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.fund = options.fund;
            this.parentId = this.fund.id;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('offerings-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('offerings-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('offerings-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('offerings-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('offerings-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('offerings-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('offerings-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('offerings-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #offerings-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #offerings-table-toolbar [data-action="read"]'  : 'openReadModal',
            'click #offerings-table-toolbar [data-action="update"]': 'openUpdateModal',
            'click #offerings-table-toolbar [data-action="delete"]': 'openDeleteModal',
            'click #offerings-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('fund_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('offerings/export'),
                data: {
                    where: {
                        fund_id: parentId
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'fund-' + parentId + '-offerings.csv',
                        'text/csv; charset=UTF-8'
                    );
                },
            });
        },
        
    });
    
    App.Offerings.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Panel: Attachments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Toolbar = App.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var OfferingsAttachmentsPanel = View.extend({
        
        offering: undefined,
        parent: 'Offerings',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.modal = options.modal;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Offerings.AttachmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('offerings-attachments-table'),
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                collection: this.collection,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.download();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Attachments.Toolbar({
                el: document.getElementById(
                    'offerings-attachments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'offerings-attachments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'offerings-attachments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var self = this;
            var modal = new App.Attachments.CreateModal({
                el: document.getElementById(
                    'offerings-attachments-create-modal'
                ),
                formId: 'offerings-attachments-create-form',
                alertElement: 'offerings-attachments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.offering.set('attachments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var self = this;
            var modal = new App.Attachments.UpdateModal({
                el: document.getElementById(
                    'offerings-attachments-update-modal'
                ),
                formId: 'offerings-attachments-update-form',
                alertElement: 'offerings-attachments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.offering.set('attachments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var self = this;
            var collection = this.collection;
            var modal = new App.Attachments.DeleteModal({
                el: document.getElementById(
                    'offerings-attachments-delete-modal'
                ),
                profileId: 'offerings-attachments-delete-profile',
                alertElement: 'offerings-attachments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.offering.set('attachments', collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (offering) {
            this.offering = offering;
            this.parentId = offering.id;
            this.collection.reset(offering.get('attachments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #offerings-attachments-table-toolbar > [data-action="download"]'  : 'download',
            'click #offerings-attachments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #offerings-attachments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #offerings-attachments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Download
         |----------------------------------------------------------------
         */
        
        download: function () {
            var model = this.table.selected;
            window.location = App.url('attachments/download/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new App.Attachments.Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
    });
    
    App.Offerings.AttachmentsPanel = OfferingsAttachmentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Panel: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Toolbar = App.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var OfferingsCommentsPanel = View.extend({
        
        offering: undefined,
        parent: 'Offerings',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.modal = options.modal;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Offerings.CommentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                el: document.getElementById('offerings-comments-table'),
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                collection: this.collection,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openUpdateModal();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Comments.Toolbar({
                el: document.getElementById(
                    'offerings-comments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'offerings-comments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'offerings-comments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var self = this;
            var modal = new App.Comments.CreateModal({
                el: document.getElementById(
                    'offerings-comments-create-modal'
                ),
                formId: 'offerings-comments-create-form',
                alertElement: 'offerings-comments-create-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.add(model);
                self.offering.set('comments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var self = this;
            var modal = new App.Comments.UpdateModal({
                el: document.getElementById(
                    'offerings-comments-update-modal'
                ),
                formId: 'offerings-comments-update-form',
                alertElement: 'offerings-comments-update-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.collection.trigger('update');
                self.offering.set('comments', self.collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var self = this;
            var collection = this.collection;
            var modal = new App.Comments.DeleteModal({
                el: document.getElementById(
                    'offerings-comments-delete-modal'
                ),
                profileId: 'offerings-comments-delete-profile',
                alertElement: 'offerings-comments-delete-modal-alert'
            });
            
            modal.on('cancel', function () {
                modal.swap(self.modal);
            });
            
            modal.on('success', function (model) {
                self.offering.set('comments', collection.toJSON());
                modal.swap(self.modal);
            });
            
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Reset
         |----------------------------------------------------------------
         */
        
        reset: function (offering) {
            this.offering = offering;
            this.parentId = offering.id;
            this.collection.reset(offering.get('comments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #offerings-comments-table-toolbar > [data-action="create"]': 'openCreateModal',
            'click #offerings-comments-table-toolbar > [data-action="read"]'  : 'openReadModal',
            'click #offerings-comments-table-toolbar > [data-action="update"]': 'openUpdateModal',
            'click #offerings-comments-table-toolbar > [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new App.Comments.Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            this.modal.swap(modal);
        },
        
    });
    
    App.Offerings.CommentsPanel = OfferingsCommentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Panel: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var View = App.View;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var OfferingsInvestmentsPanel = View.extend({
        
        offering: undefined,
        parent: 'Offerings',
        parentId: undefined,
        table: undefined,
        toolbar: undefined,
        searchbox: undefined,
        pagination: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.initTable();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function (options) {
            var self = this;
            var Table = App.Offerings.InvestmentsTable;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            var table = new Table({
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                el: document.getElementById('offerings-investments-table'),
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read();
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new App.Investments.Toolbar({
                el: document.getElementById(
                    'offerings-investments-table-toolbar'
                ),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById(
                    'offerings-investments-table-searchbox'
                ),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById(
                    'offerings-investments-table-pagination'
                ),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        reset: function (offering) {
            this.offering = offering;
            this.parentId = offering.id;
            this.collection.reset(offering.get('investments'));
            this.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #offerings-investments-table-toolbar [data-action="read"]': 'read',
            'click #offerings-investments-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            if (!model) return;
            window.location = App.url('investments/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            $.ajax({
                url: App.url('investments/export'),
                data: {
                    where: {
                        'offering_id': this.parentId
                    }
                },
                success: function (data) {
                    _.forceDownload(data, 'investments.csv', 'text/csv; charset=UTF-8');
                },
            });
        },
        
    });
    
    App.Offerings.InvestmentsPanel = OfferingsInvestmentsPanel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Table: Attachments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var AttachmentsTable = Table.extend({
        
        emptyMessage: 'No attachments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            mime: Table.formats.mime,
            size: Table.formats.size,
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Offerings.AttachmentsTable = AttachmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Table: Comments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var CommentsTable = Table.extend({
        
        emptyMessage: 'No comments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            created: Table.formats.date,
            modified: Table.formats.date,
            created_by: Table.formats.createdBy,
        }
        
    });
    
    App.Offerings.CommentsTable = CommentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\Table: Investments
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Table = App.Table;
    
    var InvestmentsTable = Table.extend({
        
        emptyMessage: 'No investments found',
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            balance: Table.formats.currency,
            created: Table.formats.date,
            modified: Table.formats.date,
        }
        
    });
    
    App.Offerings.InvestmentsTable = InvestmentsTable;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var View = Offerings.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Offerings.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var View = Offerings.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Offerings.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var View = Offerings.View;
    var Model = Offerings.Model;
    var Table = Offerings.Table;
    var Toolbar = Offerings.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Offerings.CreateModal;
    var UpdateModal = Offerings.UpdateModal;
    var DeleteModal = Offerings.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('offerings-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('offerings-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('offerings-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('offerings-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('offerings-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('offerings-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('offerings-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('offerings/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Offerings.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Offerings\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Offerings = App.Offerings;
    var View = Offerings.View;
    var Model = Offerings.Model;
    var Profile = Offerings.ReadProfile;
    var UpdateModal = Offerings.UpdateModal;
    var DeleteModal = Offerings.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('offerings-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Offerings',
                parentId: model.id,
                el: document.getElementById('offerings-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Offerings',
                parentId: model.id,
                el: document.getElementById('offerings-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('offerings-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('offerings-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Offerings.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Statements = App.Statements;
    var View = Statements.View;
    var Model = Statements.Model;
    var Table = Statements.Table;
    var Toolbar = Statements.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var SyncModal = Statements.SyncModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('statements-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                sortField: 'date',
                sortOrder: 'desc',
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('statements-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('statements-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('statements-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initSyncModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize syn modal
         |----------------------------------------------------------------
         */
        
        initSyncModal: function () {
            var modal = new SyncModal({
                el: document.getElementById('statements-sync-modal')
            });
            this.syncModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #statements-table-toolbar [data-action="sync"]': 'openSyncModal',
            'click #statements-table-toolbar [data-action="download"]'  : 'download',
        },
        
        /*
         |----------------------------------------------------------------
         | Download
         |----------------------------------------------------------------
         */
        
        download: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open sync modal
         |----------------------------------------------------------------
         */
        
        openSyncModal: function () {
            var modal = this.syncModal;
            modal.open();
        },
        
    });
    
    App.Statements.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var View = Statements.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Statements.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var View = Statements.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Statements.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var View = Statements.View;
    var Model = Statements.Model;
    var Table = Statements.Table;
    var Toolbar = Statements.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Statements.CreateModal;
    var UpdateModal = Statements.UpdateModal;
    var DeleteModal = Statements.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('statements-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('statements-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('statements-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('statements-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('statements-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('statements-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('statements-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('statements/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Statements.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Statements\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Statements = App.Statements;
    var View = Statements.View;
    var Model = Statements.Model;
    var Profile = Statements.ReadProfile;
    var UpdateModal = Statements.UpdateModal;
    var DeleteModal = Statements.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('statements-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Statements',
                parentId: model.id,
                el: document.getElementById('statements-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Statements',
                parentId: model.id,
                el: document.getElementById('statements-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('statements-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('statements-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Statements.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Transactions = App.Transactions;
    var View = Transactions.View;
    var Model = Transactions.Model;
    var Table = Transactions.Table;
    var Toolbar = Transactions.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Transactions.ReadModal;
    var CreateModal = Transactions.CreateModal;
    var UpdateModal = Transactions.UpdateModal;
    var DeleteModal = Transactions.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        investment: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.investment = options.investment;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('transactions-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
                sortField: 'date',
                sortOrder: 'asc',
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('transactions-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('transactions-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('transactions-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var panel = this;
            var collection = this.collection;
            var modal = new CreateModal({
                investment: this.investment,
                el: document.getElementById('transactions-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
                panel.trigger('update');
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('transactions-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var panel = this;
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('transactions-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
                panel.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var panel = this;
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('transactions-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
                panel.trigger('update');
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #transactions-table-toolbar [data-action="create"]': 'openCreateModal',
            'click #transactions-table-toolbar [data-action="read"]'  : 'openReadModal',
            'click #transactions-table-toolbar [data-action="update"]': 'openUpdateModal',
            'click #transactions-table-toolbar [data-action="delete"]': 'openDeleteModal',
            'click #transactions-table-toolbar [data-action="export"]': 'export',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('date', new Date());
            model.set('max_amount', this.investment.get('balance'));
            model.set('investment_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            model.set('max_amount', 
                this.investment.get('balance') + model.get('amount')
            );
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Export
         |----------------------------------------------------------------
         */
        
        export: function () {
            var parentId = this.parentId;
            $.ajax({
                url: App.url('transactions/export'),
                data: {
                    where: {
                        investment_id: parentId
                    }
                },
                success: function (content) {
                    _.forceDownload(
                        content,
                        'investment-' + parentId + '-transactions.csv',
                        'text/csv;encoding:utf-8'
                    );
                },
            });
        },
        
    });
    
    App.Transactions.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\View: Export
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var View = Transactions.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ExportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Transactions.views.ExportView = ExportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\View: Import
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var View = Transactions.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ImportView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Transactions.views.ImportView = ImportView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var View = Transactions.View;
    var Model = Transactions.Model;
    var Table = Transactions.Table;
    var Toolbar = Transactions.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Transactions.CreateModal;
    var UpdateModal = Transactions.UpdateModal;
    var DeleteModal = Transactions.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('transactions-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('empty', function () {
                toolbar.reset(undefined);
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('transactions-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('transactions-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('transactions-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('transactions-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('transactions-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('transactions-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="read"]': 'read',
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Read
         |----------------------------------------------------------------
         */
        
        read: function () {
            var model = this.table.selected;
            window.location.href = App.url('transactions/' + model.id);
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Transactions.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Transactions\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Transactions = App.Transactions;
    var View = Transactions.View;
    var Model = Transactions.Model;
    var Profile = Transactions.ReadProfile;
    var UpdateModal = Transactions.UpdateModal;
    var DeleteModal = Transactions.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            this.initComments();
            this.initAttachments();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('transactions-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Transactions',
                parentId: model.id,
                el: document.getElementById('transactions-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Transactions',
                parentId: model.id,
                el: document.getElementById('transactions-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('transactions-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('transactions-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            this.commentsPanel.render();
            this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Transactions.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users: Panel
 |------------------------------------------------------------------------
 */

(function(App){
     
    var Users = App.Users;
    var View = Users.View;
    var Model = Users.Model;
    var Table = Users.Table;
    var Toolbar = Users.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var ReadModal = Users.ReadModal;
    var CreateModal = Users.CreateModal;
    var UpdateModal = Users.UpdateModal;
    var DeleteModal = Users.DeleteModal;
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var Panel = View.extend({
        
        parent: undefined,
        parentId: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function (options) {
            this.parent = options.parent;
            this.parentId = options.parentId;
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('users-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                if (!model) return;
                self.openReadModal(model);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('users-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('users-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('users-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initReadModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('users-create-modal'),
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize read modal
         |----------------------------------------------------------------
         */
        
        initReadModal: function () {
            var self = this;
            var modal = new ReadModal({
                el: document.getElementById('users-read-modal'),
            });
            modal.on('update', function (model) {
                self.openUpdateModal(model);
            });
            this.readModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('users-update-modal'),
            });
            modal.on('success', function () {
                collection.trigger('update', collection, {});
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('users-delete-modal'),
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="create"]': 'openCreateModal',
            'click [data-action="read"]'  : 'openReadModal',
            'click [data-action="update"]': 'openUpdateModal',
            'click [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open create modal
         |----------------------------------------------------------------
         */
        
        openCreateModal: function () {
            var model = new Model();
            var modal = this.createModal;
            model.set('parent', this.parent);
            model.set('parent_id', this.parentId);
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open read modal
         |----------------------------------------------------------------
         */
        
        openReadModal: function () {
            var model = this.table.selected;
            var modal = this.readModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.table.selected;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.table.selected;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Users.Panel = Panel;
     
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Create
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;
    var Form = Users.CreateForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var CreateView = View.extend({
        
        alertElement: 'users-create-form-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initElement();
            this.initModel();
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize element
         |----------------------------------------------------------------
         */
        
        initElement: function () {
            var $submit = this.$el.find('[data-action="submit"]');
            this.$submit = $submit;
            this.$submitIcon = $submit.find('.fa');
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize model
         |----------------------------------------------------------------
         */
        
        initModel: function () {
            var model = this.model;
            model.validate = function (attrs) {
                if (!attrs.username) {
                    return "Please provide an email address";
                }
                if (!attrs.password) {
                    return "Please provide a password";
                }
                if (!attrs.password2) {
                    return "Please confirm your password";
                }
                if (attrs.password !== attrs.password2) {
                    return "The passwords you entered do not match";
                }
            }
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new Form({
                model: this.model,
                el: document.getElementById('users-create-form')
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="submit"]': 'submit'
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var self = this;
            var form = this.form;
            var alert = this.alert;
            var model = this.model;
            
            function success (url) {
                events('off');
                self.loading(false);
                window.location = App.url('verify-email-sent/' + model.get('token'));
            }
            
            function error (message) {
                events('off');
                self.loading(false);
                alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('success', success);
                form[toggle]('error', error);
            }
            
            events('on');
            this.loading(true);
            alert.clear();
            form.submit();
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state on
         |----------------------------------------------------------------
         */
        
        loadingStateOn: function () {
            this.$submitIcon.removeClass('fa-user-plus');
            this.$submitIcon.addClass('fa-spinner fa-pulse');
        },
        
        /*
         |----------------------------------------------------------------
         | Loading state off
         |----------------------------------------------------------------
         */
        
        loadingStateOff: function () {
            this.$submitIcon.removeClass('fa-spinner fa-pulse');
            this.$submitIcon.addClass('fa-user-plus');
        },
        
    });
    
    App.Users.views.Create = CreateView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Forgot password
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ForgotPasswordView = View.extend({
        
        alertElement: 'users-forgot-password-form-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click #users-forgot-password-form [data-action="submit"]': 'submit',
        },
        
        submit: function () {
            if (this.isLoading()) return;
            var self = this;
            var model = this.model;
            this.loading(true);
            $.ajax({
                url: App.url('verify-email-resend/' + model.get('token') + '.json'),
                complete: function () {
                    self.loading(true);
                },
            });
        },
        
    });
    
    App.Users.views.ForgotPassword = ForgotPasswordView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Index
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;
    var Model = Users.Model;
    var Table = Users.Table;
    var Toolbar = Users.Toolbar;
    var Searchbox = App.Searchbox;
    var Pagination = App.Pagination;
    var CreateModal = Users.CreateModal;
    var UpdateModal = Users.UpdateModal;
    var DeleteModal = Users.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var IndexView = View.extend({
        
        table: undefined,
        createModal: undefined,
        updateModal: undefined,
        deleteModal: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initTable();
            this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize table
         |----------------------------------------------------------------
         */
        
        initTable: function () {
            var self = this;
            var toolbar = this.initToolbar();
            var searchbox = this.initSearchbox();
            var pagination = this.initPagination();
            
            var table = new Table({
                el: document.getElementById('users-table'),
                collection: this.collection,
                toolbar: toolbar,
                searchbox: searchbox,
                pagination: pagination,
            });
            
            table.on('select', function (model) {
                toolbar.reset(model);
            });
            
            table.on('deselect', function () {
                toolbar.reset(undefined);
            });
            
            table.on('dblclick', function (model) {
                self.read(model.id);
            });
            
            this.table = table;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize toolbar
         |----------------------------------------------------------------
         */
        
        initToolbar: function () {
            var toolbar = new Toolbar({
                el: document.getElementById('users-table-toolbar'),
            });
            this.toolbar = toolbar;
            return toolbar;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize searchbox
         |----------------------------------------------------------------
         */
        
        initSearchbox: function () {
            var searchbox = new Searchbox({
                el: document.getElementById('users-table-searchbox'),
            });
            this.searchbox = searchbox;
            return searchbox;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize pagination
         |----------------------------------------------------------------
         */
        
        initPagination: function () {
            var pagination = new Pagination({
                el: document.getElementById('users-table-pagination'),
            });
            this.pagination = pagination;
            return pagination;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initCreateModal();
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize create modal
         |----------------------------------------------------------------
         */
        
        initCreateModal: function () {
            var collection = this.collection;
            var modal = new CreateModal({
                el: document.getElementById('users-create-modal')
            });
            modal.on('success', function (model) {
                collection.add(model);
            });
            this.createModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var collection = this.collection;
            var modal = new UpdateModal({
                el: document.getElementById('users-update-modal')
            });
            modal.on('success', function (model) {
                collection.trigger('update');
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var collection = this.collection;
            var modal = new DeleteModal({
                el: document.getElementById('users-delete-modal')
            });
            modal.on('success', function (model) {
                collection.remove(model);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.table.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="reset-password"]': 'openResetPasswordModal',
            'click [data-action="change-role"]': 'openChangeRoleModal',
            'click [data-action="lock"]': 'openLockModal',
            'click [data-action="unlock"]': 'openUnlockModal'
        },
        
        /*
         |----------------------------------------------------------------
         | Open reset password modal
         |----------------------------------------------------------------
         */
        
        openResetPasswordModal: function () {},
        
        /*
         |----------------------------------------------------------------
         | Open change role modal
         |----------------------------------------------------------------
         */
        
        openChangeRoleModal: function () {},
        
        /*
         |----------------------------------------------------------------
         | Open lock modal
         |----------------------------------------------------------------
         */
        
        openLockModal: function () {},
        
        /*
         |----------------------------------------------------------------
         | Open unlock modal
         |----------------------------------------------------------------
         */
        
        openUnlockModal: function () {},
        
    });
    
    App.Users.views.Index = IndexView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Login
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;
    var Model = Users.Model;
    var Form = Users.LoginForm;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var LoginView = View.extend({
        
        form: undefined,
        alertElement: 'users-login-form-alert',
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initForm();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize form
         |----------------------------------------------------------------
         */
        
        initForm: function () {
            var form = new Form({
                el: document.getElementById('users-login-form'),
                model: this.model
            });
            this.form = form;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.form.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="submit"]': 'submit',
        },
        
        /*
         |----------------------------------------------------------------
         | Submit
         |----------------------------------------------------------------
         */
        
        submit: function () {
            var self = this;
            var form = this.form;
            var alert = this.alert;
            
            function success (url) {
                events('off');
                self.loading(false);
                window.location = App.url();
            }
            
            function error (message) {
                events('off');
                self.loading(false);
                alert.set(message);
            }
            
            function events (toggle) {
                form[toggle]('success', success);
                form[toggle]('error', error);
            }
            
            events('on');
            this.loading(true);
            alert.clear();
            form.submit();
        },
        
    });
    
    App.Users.views.Login = LoginView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;
    var Model = Users.Model;
    var Profile = Users.ReadProfile;
    var UpdateModal = Users.UpdateModal;
    var DeleteModal = Users.DeleteModal;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadView = View.extend({
        
        profile: undefined,
        commentsPanel: undefined,
        attachmentsPanel: undefined,
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.initProfile();
            //this.initComments();
            //this.initAttachments();
            //this.initModals();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize profile
         |----------------------------------------------------------------
         */
        
        initProfile: function () {
            var profile = new Profile({
                el: document.getElementById('users-read-profile'),
                model: this.model
            });
            this.profile = profile;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize comments
         |----------------------------------------------------------------
         */
        
        initComments: function () {
            var model = this.model;
            var Comments = App.Comments;
            var Panel = Comments.Panel;
            var Collection = Comments.Collection;
            var comments = new Collection(model.get('comments'));
            
            var panel = new Panel({
                parent: 'Users',
                parentId: model.id,
                el: document.getElementById('users-comments-panel'),
                collection: comments
            });
            
            this.commentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize attachments
         |----------------------------------------------------------------
         */
        
        initAttachments: function () {
            var model = this.model;
            var Attachments = App.Attachments;
            var Panel = Attachments.Panel;
            var Collection = Attachments.Collection;
            var attachments = new Collection(model.get('attachments'));
            
            var panel = new Panel({
                parent: 'Users',
                parentId: model.id,
                el: document.getElementById('users-attachments-panel'),
                collection: attachments
            });
            
            this.attachmentsPanel = panel;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize modals
         |----------------------------------------------------------------
         */
        
        initModals: function () {
            this.initUpdateModal();
            this.initDeleteModal();
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize update modal
         |----------------------------------------------------------------
         */
        
        initUpdateModal: function () {
            var profile = this.profile;
            var modal = new UpdateModal({
                el: document.getElementById('users-update-modal'),
                model: this.model
            });
            modal.on('success', function () {
                profile.render();
            });
            this.updateModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Initialize delete modal
         |----------------------------------------------------------------
         */
        
        initDeleteModal: function () {
            var profile = this.profile;
            var modal = new DeleteModal({
                el: document.getElementById('users-delete-modal'),
                model: this.model
            });
            modal.on('success', function (model) {
                window.location = App.url(model.urlRoot);
            });
            this.deleteModal = modal;
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            this.profile.render();
            //this.commentsPanel.render();
            //this.attachmentsPanel.render();
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click .sidebar [data-action="update"]': 'openUpdateModal',
            'click .sidebar [data-action="delete"]': 'openDeleteModal',
        },
        
        /*
         |----------------------------------------------------------------
         | Open update modal
         |----------------------------------------------------------------
         */
        
        openUpdateModal: function () {
            var model = this.model;
            var modal = this.updateModal;
            modal.reset(model);
            modal.open();
        },
        
        /*
         |----------------------------------------------------------------
         | Open delete modal
         |----------------------------------------------------------------
         */
        
        openDeleteModal: function () {
            var model = this.model;
            var modal = this.deleteModal;
            modal.reset(model);
            modal.open();
        },
        
    });
    
    App.Users.views.Read = ReadView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Reset password
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ResetPasswordView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            
        },
        
    });
    
    App.Users.views.ResetPassword = ResetPasswordView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Verfiy email sent
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var VerifyEmailSentView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            this.$resend = this.$el.find('[data-action="resend"]');
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="resend"]': 'resend',
        },
        
        /*
         |----------------------------------------------------------------
         | Resend
         |----------------------------------------------------------------
         */
        
        resend: function () {
            if (this.isLoading()) return;
            var self = this;
            var model = this.model;
            this.loading(true);
            $.ajax({
                url: App.url('verify-email-resend/' + model.get('token') + '.json'),
                complete: function () {
                    self.loading(false);
                },
            });
        },
        
        loadingStateOn: function () {
            var span = document.createElement('span');
            span.className = 'fa fa-spinner fa-pulse';
            this.$resend.prepend(span);
        },
        
        loadingStateOff: function () {
            this.$resend.find('.fa').remove();
        }
        
    });
    
    App.Users.views.VerifyEmailSent = VerifyEmailSentView;
    
}(App));

/*
 |------------------------------------------------------------------------
 | App\Users\View: Verfiy email
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Users = App.Users;
    var View = Users.View;

    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var VerifyEmailView = View.extend({
        
        /*
         |----------------------------------------------------------------
         | Initialize
         |----------------------------------------------------------------
         */
        
        initialize: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Render
         |----------------------------------------------------------------
         */
        
        render: function () {
            
        },
        
        /*
         |----------------------------------------------------------------
         | Events
         |----------------------------------------------------------------
         */
        
        events: {
            'click [data-action="resend"]': 'resendRegistrationEmail',
            'click #users-update-password-form [data-action="submit"]': 'sumbitUpdatePassword'
        },
        
        /*
         |----------------------------------------------------------------
         | Resend
         |----------------------------------------------------------------
         */
        
        resendRegistrationEmail: function () {
            
        },
        
        sumbitUpdatePassword: function () {
            
        },
        
    });
    
    App.Users.views.VerifyEmail = VerifyEmailView;
    
}(App));
