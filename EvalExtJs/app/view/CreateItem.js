Ext.define('RM.view.CreateItem', {
	extend: 'Ext.Panel',
	xtype: 'createitem',
    requires: 'RM.component.RMToggleField',
	config: {
		layout: 'fit',
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				items: [
					{
						itemId: 'back',
						ui: 'rm_topbarbuttonleft',
						width: '2.6em',
						icon: 'resources/images/icons/rm-back.svg',
                        iconCls: 'rm-backbtniconcls'
					}, {
						xtype: 'component',
						itemId: 'title',
						html: 'Create a new item',
						cls: 'rm-topbartitle'
					}, {
						xtype: 'spacer'
					}, {
						text: 'Save',
						itemId: 'save',                        
						ui: 'rm_topbarbuttonright'
					}
				]
			},{
				xtype: 'secureformpanel',			
				flex: 1,
				padding: 0,
				defaults: {xtype: 'exttextfield', cls: 'rm-flatfield', clearIcon: false},
				items: [
					{
						xtype: 'extselectfield',
						label: 'Item type',
                        itemId:'itemType',
						usePicker: true,
						name: 'ItemType',
						store: 'ItemTypes',
						displayField: 'Name',
						valueField: 'ItemType',
                        rmmandatory: true,
						ui:'plain',
                        placeHolder: 'select'
					},{
						label: 'Item name',
                        itemId:'itemName',
                        labelWidth: '7em',
                        rmmandatory: true,
                        name: 'Name',
                        placeHolder: 'enter',
                        value: ''
					},/* Set this field's value in controller class whenever its added back to form
                        {
                        xtype: 'rmtogglefield',                        
                        onText: 'Active',
                        offText: 'Inactive',
						label: 'Item state',
                        name: 'ActiveStatus',
                        toggleState: true                     
					},*/
                      {
                        xtype: 'rmtogglefield',
                        onText: 'Include',
                        offText: 'Exclude',
						label: 'Amounts include tax',
                        name: 'TaxInclusive',
                        labelWidth: '10em',                        
                        toggleState: false
					},{
						xtype: 'component',						
						html: '<h3 class="rm-m-1 rm-hearderbg">ITEM WILL BE SOLD FOR</h3>'                        
					},{
                        xtype: 'rmamountfield',
						label: 'Price',
                        name: 'SalePrice',
                        cls: 'rm-flatfield rm-cursor-blinkbg',  
                        placeHolder: 'enter',  
                        clearIcon: false,   
                        decimalPlaces: 2,
                        prefix: '$',
                        border: '0'                        
					},{
						xtype: 'extselectfield',
						label: 'Account',
                        itemId: 'account',
                        labelWidth: '10em',
						usePicker: true,
						name: 'SaleCategoryId',
						store: 'AccountingCategories',
						displayField: 'Name',
						valueField: 'AccountingCategoryId',
                        autoSelect: false,
                        rmmandatory: true,
                        value: null,                        
						ui:'plain',
                        placeHolder: 'select'
					},{
						xtype: 'extselectfield',
						label: 'Tax code',
						usePicker: true,
						name: 'SaleTaxCodeId',
						store: 'GSTCodes',
						displayField: 'GSTCode',
						valueField: 'GSTCodeId',
                        autoSelect: false,
                        //rmmandatory: true,
                        clearIcon: true,
                        value: null,                         
						ui:'plain',
                        placeHolder: 'select',
                        border: '1 0 1 0',
                        style: 'border-color: #DBDBDB; border-style: solid;'
					}  
				]
			}
		]
	}
});