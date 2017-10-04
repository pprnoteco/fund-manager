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
