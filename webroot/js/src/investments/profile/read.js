/*
 |------------------------------------------------------------------------
 | App\Investments\Profile: Read
 |------------------------------------------------------------------------
 */

(function(App){
    
    var Profile = App.Profile;
    
    var statusTypes = [
        'Pending',
        'Open',
        'Closed'
    ];
    
    /*
     |--------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------
     */
    
    var ReadProfile = Profile.extend({
        
        /*
         |----------------------------------------------------------------
         | Formats
         |----------------------------------------------------------------
         */
        
        formats: {
            fund: function (id) {
                var offering = this.get('offering');
                var fund = offering.fund;
                var link = document.createElement('a');
                link.innerHTML = fund.name;
                link.href = App.url('funds/' + fund.id);
                return link;
            },
            offering: function (offering) {
                var rate = offering.rate || 0;
                return offering.class + ' @ ' + rate.toFixed(3) + '%';
            },
            investor: function (id) {
                var account = this.get('account');
                var investor = account.investor;
                var link = document.createElement('a');
                link.innerHTML = investor.name;
                link.href = App.url('investors/' + investor.id);
                return link;
            },
            account: function (account) {
                return account.name;
            },
            status: function (value) {
                value || (value = 0);
                return statusTypes[value];
            },
            date: Profile.formats.date,
            amount: Profile.formats.currency,
            balance: Profile.formats.currency,
            preferred_payment: Profile.formats.currency,
            created: Profile.formats.date,
            modified: Profile.formats.date,
        }
        
    });
    
    App.Investments.ReadProfile = ReadProfile;
    
}(App));
