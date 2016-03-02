Ext.define('RM.view.dashboard.Alerts', {
    extend: 'Ext.Panel',
    xtype: 'dbalerts',
    config: {
        
		items: [{				
                html: '<h2 class="rm-hearderbg">ALERTS</h2>'
			},{
				xtype: 'container',
				layout: {
					type: 'hbox'
				},
				items:[
                    {
                        itemId: 'msg',                        
                        flex: 1
                    },
                    {
						itemId: 'invoices',
                        flex: 1
					}
                    /*{
						itemId: 'bills',
                        flex: 1
					},{
                        itemId: 'blankCont',                        
                        flex: 1
                    }*/
				]
			
			}]
    },
	
    initialize: function() {        
		this.callParent(arguments);		
		var cont = this.getComponent(1);
		//cont.getComponent('bills').element.on('tap', this.onBillsTap, this);
		cont.getComponent('invoices').element.on('tap', this.onInvoicesTap, this);
	},  
	
    setViewData: function(data) {  
        
        var alertCont = this.getComponent(1);
        var canViewInvoices = RM.PermissionsMgr.canView('Invoices');
        //var canViewBills = RM.PermissionsMgr.canView('Bills');
        var msgCont = alertCont.getComponent('msg');
        //msgCont.setHidden(canViewInvoices || canViewBills);
        msgCont.setHidden(canViewInvoices);
        msgCont.setHtml('<div class="rm-dashboard-nodata">' + RM.Consts.NoAccessMsg + '</div>');
        alertCont.getComponent('invoices').setHidden(!canViewInvoices);
        //alertCont.getComponent('bills').setHidden(!canViewBills);
        //alertCont.getComponent('blankCont').setHidden(!(canViewInvoices || canViewBills ) || (canViewInvoices && canViewBills));
        
        if (!canViewInvoices && !canViewBills) {           
            return;
        }        
        
        alertCont.getComponent('invoices').setHtml(
            '<div class="rm-digitpanel">' +
            '<div >' +
            '<div class="rm-digittext">' + data.InvoicesOverdueNr + '</div>' +
            '<div class="rm-fltl rm-mt5">' +
            '<div class="rm-billtext rm-nextgrayarrow rm-fontsize96">Invoices</div>' +            
            '<div class="rm-billtext">overdue</div>' +
            '<div class="rm-billamount">' + RM.AppMgr.formatCurrency(data.InvoicesOverdueAmount, 2) + '</div>' + 
            '</div>' +
            '<div class="rm-clr"></div>' +
            '</div>' +
            '</div>'
            );
        
        /*alertCont.getComponent('bills').setHtml(
            '<div class="rm-digitpanel">' +
            '<div >' +
            '<div class="rm-digittext">' + data.BillsOverdueNr + '</div>' +
            '<div class="rm-fltl rm-mt5">' +
            '<div class="rm-billtext rm-pl5 rm-nextgrayarrow rm-fontsize96">Bills</div>' +
            '<div class="rm-billtext">Due soon</div>' + 
            '<div class="rm-billamount">' + RM.AppMgr.formatCurrency(data.BillsOverdueAmount, 2) + '</div>' + 
            '</div>' +
            '<div class="rm-clr"></div>' +
            '</div>' +
            '</div>'           
            );*/
        /*
        this.getComponent(1).getComponent('bills').setHtml(
        '<div class="rm-digitpanel">' +
        '<div >' +
        '<div class="rm-digittext">  </div>' +
        '<div class="rm-fltl rm-mt5">' +
        '<div class="rm-billtext rm-pl5 rm-fontsize100">Bills</div>' +
        '<div class="rm-billtext">Coming soon</div>' + 
        '<div class="rm-billamount">  </div>' + 
        '</div>' +
        '<div class="rm-clr"></div>' +
        '</div>' +
        '</div>'           
        );
        */
    },
	
	/*onBillsTap: function(){
        RM.ViewMgr.showBills();
	},*/	
	
	onInvoicesTap: function(){
		RM.ViewMgr.showInvoices();	
	}
});