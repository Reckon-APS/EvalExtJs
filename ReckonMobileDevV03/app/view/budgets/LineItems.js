Ext.define('RM.view.budgets.LineItems', {
	extend: 'Ext.Panel',
	xtype: 'budgetlineitems',
    requires: ['RM.component.RMPullRefresh', 'Ext.plugin.ListPaging'],
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
						icon: 'rm-back',						
						itemId: 'resources/images/icons/rm-back.png'
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
				xtype: 'list',
                disableSelection: true,
				cls: 'rmbudgetlist',
				store: 'BudgetLineItems',
                loadingText: null,
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
    					'<span class="rm-budgetlineitem-field rm-pt5">Forecast: </span><span class="rm-budgetlineitem-value"> ${[RM.AppMgr.numberWithCommas(values.Forecast)]}</span>' +
                    '</div>' +
                    '<div>' +
    					'<span class="rm-budgetlineitem-field rm-pt5">Actual: </span><span class="rm-budgetlineitem-value"> ${[RM.AppMgr.numberWithCommas(values.Actual)]}</span>' +                
					'</div>',
					{
					calculateTotal: function(forecast, actual) {
						var totalValue = forecast - actual;
						if (totalValue < 0) {
							totalValue = Math.abs(totalValue);    //totalValue.toString().replace(/\-/g, "");
							totalValue = RM.AppMgr.numberWithCommas(totalValue);
							totalValue = "($" + totalValue + ")";
						}
						else {
							totalValue = RM.AppMgr.numberWithCommas(totalValue);
							totalValue = "$" + totalValue;
						}
						return totalValue;
					}
                            
				}),
				
				plugins: [
                    {
                        xclass: 'RM.component.RMPullRefresh',                        
                    },					
					{
						type: 'listpaging',
						autoPaging: true                        
					}
				]

			}
		]
	}
});