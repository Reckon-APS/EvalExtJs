Ext.define('RM.controller.InvoiceItemSelectC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            itemSelect: 'invoiceitemselect',
			itemsList: 'invoiceitemselect #itemslist'
        },
        control: {
            'invoiceitemselect #namefilter': {
                keyup: function(textField){
					this.nameFilter = textField.getValue();
					this.setLoadTimer();
				},
				clearicontap: function(){
					this.nameFilter = '';
					this.loadItems();
				}				
            },
			'invoiceitemselect #refresh': {
                tap: function (textField) {
                    this.loadItems();
                }
            },
            'invoiceitemselect #create': {
                tap: 'createItem'
            }
        }
    },
	
    init: function () {
        this.apiUrl = '/api/InvoiceItemSelect';
    },	
	
    createItem: function () {
        var invoiceItemDto = { Name: 'New Item', UnitPrice: 33.95 };

        Ext.Ajax.request({
            url: this.apiUrl,
            method: 'Post',
            jsonData: invoiceItemDto,
            success: function (response) {
                var resp = Ext.decode(response.responseText);
                alert(response.responseText);
            }
        });

    },
	
	loadItems: function(){
	
		Ext.Viewport.setMasked({xtype:'loadmask', message:'Loading...'});
		
		var params = {};
		if(!Ext.isEmpty(this.nameFilter))
			params.filter = Ext.encode([{property:'ItemName', value:this.nameFilter}]);
		
		Ext.Ajax.request({
			url: this.apiUrl,
			method: 'GET',			
			params: params,
			success: function(response){
				Ext.Viewport.setMasked(false);
				var recs = Ext.decode(response.responseText).recs, names = '';				
				
				for(var i = 0; i < recs.length; i++){
					names += recs[i].Name + ' ' + recs[i].Amount + '<br/>';
					if(recs[i].Items){
						for(var j = 0; j < recs[i].Items.length; j++){
							names += '&nbsp;&nbsp;&nbsp;' + recs[i].Items[j].Name + ' ' + recs[i].Items[j].Amount + '<br/>';					
						}
					}
				}
				this.getItemsList().setHtml(names);				
			},
			scope: this
		});		
		
	},
	
	setLoadTimer: function(){
		if(this.loadTimer){
			clearTimeout(this.loadTimer);
			this.loadTimer = null;
		}						
		this.loadTimer = Ext.defer(this.loadItems, 700, this);	
	}	

});