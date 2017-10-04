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
