Ext.define('RM.view.budgets.LineItems', {
	extend: 'Ext.Panel',
	xtype: 'budgetlineitems',
    requires: 'RM.component.RMList',
	config: {
		
		layout: 'fit',
        style: 'background: #FFF;',
		items: [
			{
				xtype: 'toolbar',				
				docked: 'top',				
				items: [
					{
						xtype: 'button',
						ui: 'rm_topbarbuttonleft',
						icon: 'resources/images/icons/rm-back.svg',                        
                        iconCls: 'rm-backbtniconcls',
						itemId: 'back'
                        
					}, {
						xtype: 'component',
						html: 'Budget',
						itemId: 'title',
                        cls: 'rm-topbartitle',
					}
				]
			},{
				xtype: 'toolbar',
                ui: 'rm-sortsearch-topbar',
                docked: 'top',
				items: [
                     {
                         xtype: 'rmcheckbox',
                         text: 'Hide zero dollar budget items',
                         leftAlignCheckbox: true,
                         labelCls: 'rm-budgetcheckboxtext',
                         padding: '0 15 0 13'
					}
				]
			},{
				xtype: 'rmlist',
                disableSelection: true,
				cls: 'rmbudgetlist',
				store: 'BudgetLineItems',
                loadingText: null,
                emptyText: 'No items found.',
				itemTpl: new Ext.XTemplate(
					'<tpl if="AcctCatName == \'TOTAL\'">' +
					'<div class="rmbudgetlistcoloredbg">' +
					'<tpl else>' +
					'<div class="rmbudgetlistplainbg">' +
					'</tpl>' +					
					'<div>' +
    					'<div style="width: 65%; display: inline-block;"><div class="rm-budgetlineitem-name">{AcctCatName}</div></div>' +
    					'<div style="width: 35%; display: inline-block;"><div class="rm-budgetlineitem-name rm-alignr">{[this.calculateTotal(values.Forecast, values.Actual)]}</div></td>' + 
    				'</div>' +
    				'<div>' +
    					'<span class="rm-budgetlineitem-field rm-pt5">Forecast: </span><span class="rm-budgetlineitem-value"> {[RM.AppMgr.formatCurrency(values.Forecast)]}</span>' +
                    '</div>' +
                    '<div>' +
    					'<span class="rm-budgetlineitem-field rm-pt5">Actual: </span><span class="rm-budgetlineitem-value"> {[RM.AppMgr.formatCurrency(values.Actual)]}</span>' +                
					'</div>',
					{
					calculateTotal: function(forecast, actual) {
						var totalValue = forecast - actual;						
						return RM.AppMgr.formatCurrency(totalValue, 2, true);
					}                            
				})
			}
		]
	}
});