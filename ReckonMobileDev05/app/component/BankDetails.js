Ext.define('RM.component.BankDetails', {
    extend: 'Ext.Container',
    requires: ['RM.component.BankDetailsNZ', 'RM.component.BankDetailsAU'],
    xtype: 'bankdetails',
    config: {
        items: []
    },

    initialize: function () {
        this.callParent(arguments);
        this.loadCountrySpecificBankDetails();
    },

    loadCountrySpecificBankDetails: function () {
        this.removeAll(true, true);
        var countryCode = RM.CashbookMgr.getCountrySettings().CountryCode;

        if (countryCode === "AU") {
            this.add({
                xtype: 'bankdetailsau'
            });                  
        }

        if (countryCode === "NZ") {
            this.add({
                xtype: 'bankdetailsnz'
            });
        }
    },

    resetValues: function () {
        //at any time this panel is gonna show just one child panel so select 0th and reset all its children fields
        this.getItems().items[0].getItems().items.forEach(function (item) {
            item.reset();
        });
    }
});