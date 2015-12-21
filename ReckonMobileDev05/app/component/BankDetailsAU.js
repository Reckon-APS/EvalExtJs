Ext.define('RM.component.BankDetailsAU', {
    extend: 'Ext.Container',
    xtype: 'bankdetailsau',    
    config: {        
        items: [
        {
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