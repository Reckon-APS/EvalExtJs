Ext.define('RM.component.BankDetailsNZ', {
    extend: 'Ext.Container',
    xtype: 'bankdetailsnz',
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
            xtype: 'container',
            layout: 'hbox',
            border: '1 0 1 0',
            style: 'border-color: #DBDBDB; border-style: solid;',
            items: [{
                html: 'Bank/Branch',
                flex: 7,
                cls: 'x-form-label',
                style: 'font-size: 80%; padding-top: 0.9em; padding-left: 0.7em;'
            }, {
                xtype: 'rmnumberfield',
                name: 'BankBranch',
                placeHolder: 'bank',
                maxLength: 2,
                flex: 3,
                clearIcon: false,
                border: '0 1 0 1',
                style: 'border-color: #DBDBDB; border-style: solid;'
            }, {
                xtype: 'rmnumberfield',
                placeHolder: 'branch',
                maxLength: 4,
                name: 'BankAccountNumberExtra',
                flex: 5,
                clearIcon: false,
                border: 0
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                html: 'Account number/Suffix',
                flex: 7,
                cls: 'x-form-label',
                style: 'font-size: 80%; padding-top: 0.9em; padding-left: 0.7em;'
            }, {
                xtype: 'rmnumberfield',
                cls: 'rm-flatfield',
                name: 'BankAccountNumber',
                placeHolder: 'account number',
                maxLength: 7,
                flex: 5,
                clearIcon: false,
                border: '0 1 0 1',
                style: 'border-color: #DBDBDB; border-style: solid;'
            }, {
                xtype: 'rmnumberfield',
                cls: 'rm-flatfield',
                placeHolder: 'suffix',
                maxLength: 3,
                name: 'BankSuffix',
                flex: 3,
                clearIcon: false,
                border: 0
            }]
        }]
    }
});