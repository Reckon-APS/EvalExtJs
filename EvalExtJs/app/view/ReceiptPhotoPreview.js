Ext.define('RM.view.ReceiptPhotoPreview', {
    extend: 'Ext.Panel',
    xtype: 'receiptphotopreview',
    config: {
		layout: {
          type: 'vbox',
          pack: 'end'  
        },
        cls: 'rm-whitebg',
        defaults: {
					xtype: 'button'
                    	
				},
		 items:[
            {
                xtype: 'img',
                itemId: 'photo',
                cls: 'rm-whitebg',
                flex: '1',
                margin: '30 20 50 20'
                
            },
            /*{
				text: 'AUTO FILL',						
				itemId: 'autofill',
                border: '1 0 0 0',
                style: 'border-color: #DBDBDB; border-style: solid;'	
                
			},*/
            {
				text: 'ATTACH',						
				itemId: 'attach',
                border: '1 0 0 0',
                cls: 'rm-photopreviewbtn rm-btnarrow-next',				
                style: 'border-color: #DBDBDB; border-style: solid;'	
			},
            {
				text: 'RETAKE PHOTO',						
				itemId: 'retake',
                border: '1 0 0 0',
                cls: 'rm-photopreviewbtn rm-btnarrow-prev',				
                style: 'border-color: #DBDBDB; border-style: solid;'
			},
            {
				text: 'CANCEL',						
				itemId: 'cancel',
                border: '1 0 1 0', 
                cls: 'rm-photopreviewbtn',
                style: 'border-color: #DBDBDB; border-style: solid;'
			},{
                xtype: 'component',
                height: '2.6em',
                cls: 'rm-whitebg',
            }
        ]
   }
});