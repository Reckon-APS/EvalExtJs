Ext.define('RM.view.ExpenseDetail', {
	extend: 'RM.component.SecurePanel',
	xtype: 'expensedetail',
	requires: ['RM.component.ExpenseLineItems', 'RM.component.RMCheckbox', 'RM.component.DurationField', 'RM.component.ExtDatePickerField'],
	config: {
	    cls: 'rm-whitebg',
		layout: 'fit',        
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',				
				items: [{					
						itemId: 'back',
						ui: 'rm_topbarbuttonleft',
						icon: 'resources/images/icons/rm-back.svg',
                        iconCls: 'rm-backbtniconcls',
                        width: '2.6em'						
					},{
						xtype: 'component',
						html: 'Expense Detail',
						cls: 'rm-topbartitle',
						itemId: 'title'
					},{
						xtype: 'spacer'
					},{
						text: 'Save',
						itemId: 'save',	                        
						ui: 'rm_topbarbuttonright'	
					}
				]
			},{
				xtype: 'container',
				layout: 'vbox',                
				items: [
					/*{				
						xtype: 'button',
						text: 'Photograph the receipt',
						cls: 'rm-arrowimgbtn rm-photobtnfont',						
						icon: 'resources/images/icons/rm-photo.svg',
                        iconCls: 'rm-photobtniconsize',
						iconAlign: 'left',
						itemId: 'photo'
					},*/{
					    xtype: 'secureformpanel',
					    permissionFor: 'ExpenseClaims',
						itemId: 'expenseForm',
						flex: 1,
						padding: 0,
                        
						items: [{
						        xtype: 'component',
						        itemId: 'expenseStatus',
                                hidden: true,
						        cls: 'rm-hearderbg'
						    },{
								xtype: 'hiddenfield',
								name: 'ExpenseClaimId'			
							},{
								xtype: 'hiddenfield',
								name: 'CustomerId'			
							},{
								xtype: 'hiddenfield',
								name: 'ProjectId'			
							}, {
							    xtype: 'extdatepickerfield',
							    name: 'ExpenseClaimDate',
							    label: 'Date',
							    rmmandatory: true,
							    dateFormat: 'jS M Y',
							    cls: 'Date-icon rm-flatfield',
							    ui: 'plain',
							    placeHolder: 'select'
							}, {
								xtype: 'exttextfield',
								name: 'ProjectName',
								label: 'Project',
								cls: 'rm-flatfield',								
								placeHolder: 'select (optional)',
								readOnly: true
							}, {
							    xtype: 'exttextfield',
							    name: 'CustomerName',
							    label: 'Customer',
							    cls: 'rm-flatfield',
							    placeHolder: 'select (optional)',
							    readOnly: true
							}, {
							    xtype: 'exttextfield',
							    name: 'ExpenseClaimNumber',
							    readOnly: true,
							    labelWidth: 135,
							    label: 'Expense number',
							    cls: 'rm-flatfield-disabled', //cls: 'rm-flatfield',
							    clearIcon: false,
							    placeHolder: 'Auto-generated',
							    labelWidth: '8em'
							}, {
							    xtype: 'exttextfield',
							    name: 'Reference',
							    labelWidth: 160,
							    label: 'Reference',
							    placeHolder: 'enter',
							    cls: 'rm-flatfield',
							    clearIcon: false,
							    labelWidth: '8.5em'
							}, {
							    xtype: 'extselectfield',
							    label: 'Gross/Net',
							    usePicker: true,
							    name: 'AmountTaxStatus',
							    labelWidth: '6em',
							    store: 'TaxStatuses',
							    displayField: 'Name',
							    valueField: 'TaxStatusId',
							    autoSelect: false,
							    value: null,
							    placeHolder: 'select',
							    cls: 'rm-flatfield',
							    ui: 'plain',
							    rmmandatory: true
							}, {
                                xtype: 'rmamountfield',                                   
								name: 'ExpenseClaimAmount',
								label: 'Total amount',
								labelWidth: '8em',
								cls: 'rm-flatfield',                                    
								placeHolder: 'enter',
								clearIcon: false,   
                                decimalPlaces: 2,
                                prefix: '$'                                
							}, {
							    xtype: 'rmamountfield',
							    name: 'BalanceDue',
							    label: 'Balance due',
							    labelWidth: '8em',
							    cls: ['rm-flatfield', 'rm-flatfield-last'],
							    placeHolder: 'enter',
							    clearIcon: false,
							    decimalPlaces: 2,
							    prefix: '$'
							}, {
							    xtype: 'expenselineitems'
							}
						]
					}
			
				]
			}
		]
	}
});