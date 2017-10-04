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
