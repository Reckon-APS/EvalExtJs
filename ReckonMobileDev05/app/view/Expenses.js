Ext.define('RM.view.Expenses', {
	extend: 'Ext.Panel',
	xtype: 'expenses',
	requires: ['RM.component.RMList', 'RM.component.RMCalendar'],
	config: {
	    layout: 'vbox',
	    items: [
			{
			    xtype: 'toolbar',
			    docked: 'top',
			    items: [
					{
					    xtype: 'component',
					    html: 'Expenses',
					    cls: 'rm-topbartitle'
					}, {
					    xtype: 'spacer'

					}, {
					    text: 'Add',
					    itemId: 'add',
					    xtype: 'securebutton',
					    permissionFor: 'Expenses',
					    ui: 'rm_topbarbuttonright'
					}
			    ]
			}, {
			    xtype: 'tabpanel',
			    cls: 'rm-tabbar',
			    tabBar: {
			        defaults: {
			            flex: 1
			        },
			        layout: { pack: 'center' }
			    },
			    items: [{
			        title: 'List',
			        xtype: 'panel',
			        layout: 'vbox',
			        items: [
			            {
			                xtype: 'sortsearchbar',
			                docked: 'top',
			                sortfields: [
                                { text: 'Date', value: 'ClaimDate' },
                                { text: 'Amount', value: 'ClaimAmount' },
                                { text: 'Status', value: 'Status' }
                                                                
			                ]
			            }, {
			                xtype: 'rmlist',
			                store: 'Expenses',
			                flex: 1,
			                grouped: true,
			                loadingText: null,
			                emptyText: 'No expenses found.'
			            }
			        ]
			    }, {
			        title: 'Calendar',
			        xtype: 'rmcalendar',
			        store: 'ExpensesCalendar'
			    }]
			}
	    ]
	}
});