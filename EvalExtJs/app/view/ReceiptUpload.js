Ext.define('RM.view.ReceiptUpload', {
    extend: 'Ext.Panel',	
    xtype: 'receiptupload',
    config: {
        
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
			title: 'Receipt Upload',
            items: []
        }, {
            xtype: 'component',
			html: '<form enctype="multipart/form-data" method="POST" action="/api/Receipts"><input type="hidden" name="expenseId" value="00000001-0000-0000-0000-000000000000"><input id="uploadName" name="fileName" type="file"><input type="submit" value="Upload"></form>',
			padding: 5
        }
        ]
    }
});