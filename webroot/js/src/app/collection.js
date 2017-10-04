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
