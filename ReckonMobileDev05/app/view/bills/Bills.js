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
					}, {
					    xtype: 'spacer'
					}, {
					    text: 'Add',
					    itemId: 'add',
					    xtype: 'securebutton',
					    permissionFor: 'Bills',
					    ui: 'rm_topbarbuttonright'
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
				itemTpl: new Ext.XTemplate(
                        '<div>' +
                    '<div style="width: 55%; display: inline-block; vertical-align: top;">'+
                        '<div class="rm-orgnametext rm-pt5 rm-pl5">{BillNumber}</div>'+
                    '</div>' +
                    '<div style="width: 45%; display: inline-block; vertical-align: top;">'+
                        '<div class="rm-nextgrayarrow rm-pt5 rm-invoices-invoiceamount rm-alignr">' + 
                            '{[RM.AppMgr.formatCurrency(values.Status == 2 ? values.Balance : values.Amount)]}' + 
                        '</div>' +
                    '</div>'+
                '</div>' +               
                '<div>' +  
                    '<div style="width: 60%; display: inline-block; vertical-align: top;">'+
                        '<div class="rm-invoices-duestatus rm-pt5 rm-pl5 "> {[this.calculateDays(values.DueDate, values.DueDays, values.Status)]}' +
                            '<tpl if="this.isOverdue(values.DueDate, values.DueDays, values.Status)">' +                                
                                "<span class='rm-reddot'></span>" +
                                "<tpl if='RM.ViewMgr.showEmailReminder()'>"+
                                    "<span class='rm-emailreminder rm-pl5'>Send email reminder</span>" +
                                '</tpl>' +
                            '</tpl>' +
                        '</div>' +
                    '</div>'+
                    '<div style="width: 40%; display: inline-block; vertical-align: top;">'+
                            '<div class="rm-invoices-duestatus rm-alignr rm-pt5 rm-mr20">' + 
                                '<tpl if="(values.Status == 2 &amp;&amp; values.Balance &lt; values.Amount)">' +
                                    '{[RM.AppMgr.capitalizeString(RM.InvoicesMgr.getPartiallyPaidInvoiceStatusText())]}' + 
                                '<tpl else>'+
                                    '{[RM.AppMgr.capitalizeString(RM.InvoicesMgr.getInvoiceStatusText(values.Status))]}' + 
                                '</tpl>' +
                        '</div>'+
                    '</div>' +                     
                '</div>',                        
                        {
                            isOverdue: function (dueDate, dueDays, status) {
                                if (status == RM.Consts.InvoiceStatus.PAID) return false;
                                return dueDate && dueDate.getFullYear() > 1 && dueDays < 0;
                            },
                            calculateDays: function (dueDate, dueDays, status) {
                                if (status == RM.Consts.InvoiceStatus.PAID) return '';
                                if (!dueDate || dueDate.getFullYear() == 1) {
                                    return 'No due date';
                                }
                                else if (dueDays < 0) {
                                    return "Overdue"
                                }
                                else if (dueDays == 0) {
                                    return "Due today"
                                }
                                else if (dueDays == 1) {
                                    return "Due in 1 day"
                                }
                                else {
                                    return "Due in " + dueDays + " days"
                                }
                            }
                        })
			}
        ] 
    }
});