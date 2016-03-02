Ext.define('RM.controller.InvoiceTimeSelectDetailC', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			invoiceTimeSelectDetail: 'invoicetimeselectdetail',
            detailsTitle: 'invoicetimeselectdetail #detailsTitle'
		},
		control: {
			'invoicetimeselectdetail': {
				show: 'onShow'
			},            
			'invoicetimeselectdetail #back': {
				tap: 'back'
			},
			'invoicetimeselectdetail #add': {
				tap: 'add'
			}         
		}
	},

	showView: function (detailsTitle, items, cb, cbs) {
        this.detailsTitle = detailsTitle;
		this.items = items;
		this.goCb = cb;
		this.goCbs = cbs;

		//alert(Ext.encode(items));
        this.initShow = false;
        
		var view = this.getInvoiceTimeSelectDetail();
		if (!view) {
			view = { xtype: 'invoicetimeselectdetail' };
		}           
		RM.ViewMgr.showPanel(view);
	},
    
	onShow: function() {
        this.getDetailsTitle().setHtml(this.detailsTitle);
        
        if(!this.initShow){
    		var view = this.getInvoiceTimeSelectDetail();
    		view.removeAll();
    		for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
    			view.add({
        			xtype: 'invoicetimeselectdetailpan',
        			detailTitle:  (item.CustomerName ? item.CustomerName : '(no customer)') + ' - ' + item.EmployeeName,
                    itemName: item.ItemName,
                    taxCodeId: item.TaxCodeId,
                    discount: 0     
    			});
    
    		}
            this.initShow = true;
        }           
	},

	back: function () {
		RM.ViewMgr.back();
	},
    
	add: function() {
		var view = this.getInvoiceTimeSelectDetail();

		for (var i = 0; i < view.getItems().getCount(); i++) {
			var comp = view.getAt(i);
			if (comp.getViewData) {
                var itemNr = i - 1, detailsData = comp.getViewData() //toolbar is at position 0 in components in view
                this.items[itemNr].TaxCodeId = detailsData.TaxCodeId;
                //this.items[itemNr].Discount = 
			}
		}
                
		this.goCb.call(this.goCbs, this.items);
		//RM.ViewMgr.back();
		RM.ViewMgr.back();
	}  

});