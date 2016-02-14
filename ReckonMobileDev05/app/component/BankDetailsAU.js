Ext.define('RM.component.BankDetailsAU', {
    extend: 'Ext.Container',
    xtype: 'bankdetailsau',    
    config: {        
        items: [{
            xtype: 'exttextfield',
            name: 'AccountName',
            label: 'Bank account name',
            labelWidth: '9em',
            placeHolder: 'enter',
            cls: 'rm-flatfield',
            clearIcon: false
        }, {
            xtype: 'rmnumberfield',
            name: 'BankBranch',
            label: 'BSB',
            maxLength: 6
        }, {
            xtype: 'rmnumberfield',
            name: 'BankAccountNumber',
            label: 'Account number',
            labelWidth: '10em',
            cls: 'rm-flatfield'
        }
        ]
    }
    
});