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
