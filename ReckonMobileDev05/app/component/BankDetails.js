Ext.define('RM.component.BankDetails', {
    extend: 'Ext.Container',
    requires: ['RM.component.BankDetailsNZ', 'RM.component.BankDetailsAU'],
    xtype: 'bankdetails',
    config: {
        items: [/*{
            xtype: 'component',
            html: '<h3 class="rm-m-1 rm-hearderbg">Financial institution details</h3>'
        },*/ {
            xtype: 'bankdetailsnz'            
        }, {
            xtype: 'bankdetailsau'            
        }]
    },

    initialize: function () {
        this.callParent(arguments);
        this.on('painted', this.loadCountrySpecificBankDetails, this);
    },

    loadCountrySpecificBankDetails: function () {
        var countryCode = RM.CashbookMgr.getCountrySettings().CountryCode;

        if (countryCode === "AU") {
            this.remove(this.down('bankdetailsnz'));      
        }
        if (countryCode === "NZ") {           
            this.remove(this.down('bankdetailsau'));
        }
    }
});