Ext.define('RM.view.dashboard.Dashboard', {
    extend: 'Ext.Panel',
    xtype: 'dashboard',
    requires: ['RM.view.dashboard.NetPosition', 'RM.view.dashboard.Alerts', 'RM.view.dashboard.TopExpenses', 'RM.view.dashboard.BudgetOverview'],
    config: {     
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',				
                items: [
                    {
                        xtype: 'component',
                        html: 'Dashboard',
                        cls: 'rm-topbartitle'                        
                    },{
						xtype: 'spacer'					
					},{
						text: '',
						itemId: 'refresh',
						ui: 'rm_topbarbuttonright',
                        icon: 'resources/images/icons/rm-refresh.svg',
                        width: '2.6em'
					}
                ]
            },{
                xtype: 'container',
                scrollable: 'vertical',
                cls: 'rm-dashboard',                 
                itemId: 'cont',                
                padding: 5,                
                items: [                    
                    {
                        xtype: 'dbnetposition',                
                    }, {
                        xtype: 'dbalerts'
                    }, {
                        xtype: 'dbtopexpenses'
                    }, {
                        xtype: 'dbbudgetoverview'
                    }
                ]
            }, {
                xtype: 'container',
                cls:'rm-whitebg',
                hidden: true,
                itemId: 'noaccesscont',
                items: [
                    {
                        xtype: 'img',
                        src: 'resources/images/icons/rm-noaccess-icon.svg',                        
                        width: 68,
                        height: 62,
                        margin: '28px auto'  
                    },{
                        xtype: 'component',
                        html: 'You do not have enough access </br>rights to view the dashboard', 
                        cls: 'rm-update-title', 
                        margin: '-8 0 30 0'
                    },{
                        xtype: 'component',
                        html: 'Please tap the top left button to </br>gain access to other parts of this book.',
                        cls: 'rm-update-msg',  
                        margin: '20 0 20 0'
                    }                   
                ]
            }
        ]
    }/*,

    initialize: function () {
    this.callParent();
    this.on('painted', function () {
    this.fireEvent('contready')
    }, this);
    }*/
});