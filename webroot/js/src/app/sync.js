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
