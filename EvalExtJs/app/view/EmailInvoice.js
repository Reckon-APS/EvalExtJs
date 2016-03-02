Ext.define('RM.view.EmailInvoice', {
	extend: 'Ext.Panel',
	xtype: 'emailinvoice',
	requires: ['RM.component.ExtEmailField','RM.component.ExtTextAreaField','RM.component.SecureFormPanel'],
	config: {
		
		layout: 'card',
		activeItem: 0,
		items: [
			{
				xtype: 'panel',                
				layout: 'fit',
				items:[
					{
						xtype: 'toolbar',
						docked: 'top',
						items: [
							{								
								ui: 'rm_topbarbuttonleft',
								icon: 'resources/images/icons/rm-back.svg',                                
								iconCls: 'rm-backbtniconcls',
                                width: '2.6em',
								itemId: 'back'				
							},{
								xtype: 'component',
								html: 'Email customer',
								cls: 'rm-topbartitle'
							},{
								xtype: 'spacer'							
							},{
								text: 'Send',
								itemId: 'send',                                
								ui: 'rm_topbarbuttonright'
							}
						]						
					},{
						xtype: 'secureformpanel',
                        itemId: 'emailForm',
						padding: 0,
						items: [
							{
								xtype: 'extemailfield',
								name: 'Email',
								label: 'To',
								cls: 'rm-flatfield',
								clearIcon: false,
								placeHolder: 'enter',
                                rmmandatory: true,
                                labelWidth: '3em'                                
							},{
								xtype: 'extemailfield',
								name: 'CC',
								label: 'Cc',
								cls: 'rm-flatfield',
								clearIcon: false,
								placeHolder: 'enter',
                                labelWidth: '3em'                                
							},{
								xtype: 'extemailfield',
								name: 'BCC',
								label: 'Bcc',
								cls: 'rm-flatfield',
								clearIcon: false,
								placeHolder: 'enter',
                                labelWidth: '3em'                                
							},{
								xtype: 'exttextfield',
								name: 'Subject',
								label: 'Subject',
								cls: 'rm-flatfield',				                
								clearIcon: false,
								placeHolder: 'enter',
                                rmmandatory: true
							},{
								xtype: 'selectfield',
								label: '<img src="resources/images/icons/rm-attach.svg" style="margin-right: 10px; width: 18px; height: 18px;">Invoice Template',
                                labelWidth: '10em',
								usePicker: true,
								name: 'InvoiceTemplateId',
								store: 'InvoiceTemplates',
								displayField: 'Name',
								valueField: 'TemplateId',
								placeHolder: 'select',
								cls: 'rm-flatfield',
								ui: 'plain',
                                permissionFor: { name:'SalesPreferences', action:'View' }
							}, {
								xtype: 'exttextareafield',
                                maxRows: 8,
								name: 'Body',
								label: 'Custom message',								
								labelAlign: 'top',
								cls: 'rm-flatfield rm-inputel-alignl',
								clearIcon: false,
                                readOnly: true,
								placeHolder: 'enter',
                                border: '1 0 1 0',
                                style: 'border-color: #DBDBDB; border-style: solid;',
                                listeners: {                                   
                                    change: function(field) {
                                        //var numOfRows = field.getValue().split("\n").length;    
                                        var numOfRows = field.getValue().split("\n").length + Math.round(field.getValue().length/40) + 5;
                                        field.setMaxRows(numOfRows);
                                    }
                                }
							}
						]
					}
				]
			},{
				xtype:'container',
				cls: 'rm-emailinvoicebackground',
				items: [
					{
						xtype: 'container',
						layout: 'hbox',
						height: 110,
						cls: 'rm-emailpositivepanel',
						items: [
							{
								cls: 'rm-emailcheckmark',
								flex:1
							},{
								itemId: 'sentcont',							        							        
								flex:5
							}
						]
							
					},{
						xtype: 'button',
						text: 'CONTINUE',
						itemId: 'continue',
						cls: 'rm-emailscreenbtn'
					}
				]
			},{
				xtype:'container',
				cls: 'rm-emailinvoicebackground',
				items: [
					{
						xtype: 'container',
						layout: 'hbox',
						height: 130,
						cls: 'rm-emailnegativepanel',
						items: [
							{
								cls: 'rm-emailcrossmark',
								flex: 1
							},{
								itemId: 'errorcont',                                                              
								flex:5
							}
						]

					},{
						xtype: 'button',
						text: 'RETRY',
						itemId: 'retry',
						cls: 'rm-emailscreenbtn'
					},{
						xtype: 'button',
						text: 'CANCEL EMAIL',
						itemId: 'cancel',
						cls: 'rm-emailscreenbtn'
					}
				]
			}
		]		

	}
});