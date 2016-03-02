Ext.define('RM.controller.ItemDetailC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            itemDetail: 'itemdetail',
			itemForm: 'itemdetail #itemForm',
			taxCode: 'itemdetail selectfield[name=SaleTaxCodeId]'
        },
        control: {
            'itemdetail': {
                show: 'onShow'
            },
            'itemdetail #itemForm exttextfield': {
                tap: 'onFieldTap'
            },			
            'itemdetail #back': {
                tap: 'back'
            },		
            'itemdetail #add': {
                tap: 'add'
            }
		}
    },
	
    showView: function (showTaxCode, detailsData, cb, cbs) {
        
        this.detailsCb = cb;
        this.detailsCbs = cbs;

	    detailsData.Discount = (detailsData.DiscountPerc && detailsData.DiscountPerc != 0) ? detailsData.DiscountPerc + '%' : 'None';
	    detailsData.Discount = (detailsData.DiscountAmount && detailsData.DiscountAmount != 0) ? '$' + Ext.Number.toFixed(detailsData.DiscountAmount, 2) : detailsData.Discount;        
        
        this.showTaxCode = showTaxCode;
		this.detailsData = detailsData;
        
        var view = this.getItemDetail();
        
        this.initShow = false;
        
        if (!view){
            view = { xtype: 'itemdetail' };
        }
        RM.ViewMgr.showPanel(view);
    },
	
    onShow: function () {
        if(!this.initShow){
            //var data = this.detailsData;
            //data.Discount = 'None';
            //alert(Ext.encode(this.detailsData));
            
            var itemForm = this.getItemForm();
    		itemForm.setValues(Ext.applyIf(this.detailsData, {Quantity: 1}));
            this.getTaxCode().setHidden(!this.showTaxCode);
    		//itemForm.getComponent(3).setValue(this.detailsData.SaleTaxCodeId);
            
            this.initShow = true;
        }           
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
	
    
    back: function () {
        RM.ViewMgr.back();
    },

	add: function(){
		var ITEM_TYPE_CHARGEABLE_ITEM = 1;
		
		var formVals = this.getItemForm().getValues();
		//alert(Ext.encode(formVals));
		//formVals.SaleTaxCodeId = '7654913F-9486-419C-9752-8C0C2EC91E85';
		var taxRec = this.getTaxCode().getRecord();
		var amount = formVals.Quantity * this.detailsData.SalePrice;

		var item = { //fields corresponding to InvoiceLineItemDto
		    //InvoiceItemId: null, //is assigned at server
            //InvoiceId: null, //can be determined at server as line item is already inside the InvoiceDto
		    ItemType: ITEM_TYPE_CHARGEABLE_ITEM,
		    ItemId: formVals.ItemId,
		    ItemName: formVals.ItemName,
            ItemPath: formVals.ItemPath,
            ProjejctId: formVals.ProjectId,
		    Quantity: formVals.Quantity,
		    Amount: amount,
		    TaxGroupId: taxRec.get('GSTCodeId'), //formVals.SaleTaxCodeId,
			TaxRate: taxRec.get('Rate') / 100 * amount,
			UnitPrice: this.detailsData.SalePrice
        };

        if (formVals.Discount.indexOf('%') > -1) {
            //item.DiscountAmount = 0;
            item.DiscountPerc = parseFloat(formVals.Discount.replace('%', '')); //formVals.Discount.replace('%', '');
        }
        else if (formVals.Discount.indexOf('$') > -1) {
            item.DiscountAmount = parseFloat(formVals.Discount.replace('$', '')); //formVals.Discount.replace('$', '');
            //item.DiscountPerc = 0;
        }

        //alert(Ext.encode(item));
		
		this.detailsCb.call(this.detailsCbs, 'save', item);
        RM.ViewMgr.back();
	}
	
});