/*
 |------------------------------------------------------------------------
 | App\Transactions: App
 |------------------------------------------------------------------------
 */

(function(App){
    
    App.Transactions = {
        Model: undefined,
        Collection: undefined,
        View: undefined,
        views: {},
        typeDescription: function (type) {
            switch (type) {
                case 0: return 'Initial deposit';
                case 1: return 'Preferred payment (prorated)';
                case 2: return 'Preferred payment';
                case 3: return 'Drawdown';
                case '0': return 'Initial deposit';
                case '1': return 'Preferred payment (prorated)';
                case '2': return 'Preferred payment';
                case '3': return 'Drawdown';
                default: return 'Unknown';
            }
        }
    }
    
}(App));
