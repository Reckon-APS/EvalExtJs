Ext.define('RM.component.InvoiceTimeSelectDetailPan', {
	extend: 'Ext.form.Panel',
	xtype: 'invoicetimeselectdetailpan',   
	config: {
		padding: 0,
        height: 164,
		
		defaults: {xtype: 'textfield'},
		control: {
			'textfield': {
				tap: 'onFieldTap'
			}            
		}        
	},

	initialize: function () {
		this.callParent(arguments);

		this.add([
			{
				xtype: 'component',
				html: '<h3 class="rm-m-1 rm-hearderbg">' + this.config.detailTitle.toUpperCase() + '</h3>'            
			},{
				xtype: 'textfield',
				name: 'Item',
				label: 'Item',
                value: this.config.itemName,
				cls: 'rm-flatfield',
				clearIcon: false,
                border: '0 0 0 0',
                readOnly: true
                
			},{
				xtype: 'selectfield',
				label: 'Tax code',
                value: this.config.taxCodeId,
				usePicker: true,
				name: 'TaxCodeId',
				store: 'GSTCodes',
				displayField: 'GSTCode',
				valueField: 'GSTCodeId',
                placeHolder: 'Select',
                autoSelect: false,
                value: null,
				cls: 'rm-flatfield',
				ui:'plain'
			},{
				xtype: 'exttextfield',
				name: 'Discount',
				label: 'Discount',
				value: this.config.discount != 0 ? this.config.discount : 'None',
				cls: 'rm-flatfield',
				clearIcon: false,
				readOnly: true,
                border: '1 0 1 0',
                style: 'border-color: #DBDBDB; border-style: solid;'
			}
		]);
	},    
    
	onFieldTap: function (tf) {
		if (tf.getName() == 'Discount') {
			var discVal = tf.getValue();

			RM.InvoicesMgr.showChooseDiscountPopup(
				discVal == 'None' ? 0 : discVal,
				function (disc) {
					tf.setValue(disc == 0 ? 'None' : disc);
				},
				this
			);
		}
	},    
    
    getViewData: function(){
        var formVals = this.getValues();
        
        if (formVals.Discount.indexOf('%') > -1) {
            formVals.DiscountPerc = formVals.Discount.replace('%', '');
        }
        else {
            formVals.DiscountAmount = formVals.Discount.replace('$', '');
        }
        
        delete formVals.Discount;
        return formVals;
        
    }

});