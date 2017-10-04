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
