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
