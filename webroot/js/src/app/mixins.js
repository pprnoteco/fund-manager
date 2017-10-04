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
