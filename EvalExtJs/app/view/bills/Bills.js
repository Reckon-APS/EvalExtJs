Ext.define('RM.view.bills.Bills', {
   extend: 'Ext.Panel',
	xtype: 'bills',
    requires: 'RM.component.RMList',
    config: {
		
		layout: 'fit',
		items:[			{
				xtype: 'toolbar',
				docked: 'top',				
				items: [
					{
						xtype: 'component',
						html: 'Bills',
                        cls: 'rm-topbartitle',
					}
				]
			},{
				xtype: 'sortsearchbar',				
				docked: 'top',
				sortfields: [
					{text: 'Supplier',  value: 'supplier'},
					{text: 'Amount', value: 'amount'},
					{text: 'Due date',  value: 'duedate'}
				]
			},{
				xtype: 'rmlist',
				store: 'Bills',
                loadingText: null,
                emptyText: 'No bills found.',
				grouped: true,                
                disableSelection: true,				
				itemTpl: new Ext.XTemplate(
                        '<div>',
                        '<div style="width: 55%; display: inline-block;">',
                            '<div class="rm-orgnametext">{SupplierName}</div>',
                        '</div>',
                        '<div style="width: 45%; display: inline-block; vertical-align: top;">',
                            '<div class="rm-orgnametext rm-alignr">{[RM.AppMgr.formatCurrency(values.Total)]}</div>',
                        '</div>' , 
                        '</div>',
                        '<div>',
                            '<div class="rm-booknametext rm-pt5">{InvCode}</div>',
                        '</div>',
                        '<div>',
                            '<div class="rm-booknametext rm-pt5"><span style="font-weight:normal;">Due:</span> {[this.calculateDays(values.DueDays)]}',
                                '<tpl if="DueDays < 0">',
                                "<span class='rm-reddot'></span>" ,
                                '</tpl>'+
                            '</div>',
                        '</div>',                        
                        {
                            calculateDays: function(due_days){
                                if(due_days < 0){
                                    return "Overdue"
                                }
                                else if(due_days == 1){
                                    return "1 day"
                                }
                                else{
                                    return due_days+" days"
                                }
                            }
                        })
			}
        ] 
    }
});