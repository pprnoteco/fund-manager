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
