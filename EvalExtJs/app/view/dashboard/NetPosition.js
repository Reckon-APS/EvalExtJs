Ext.define('RM.view.dashboard.NetPosition', {
    extend: 'Ext.Panel',
    xtype: 'dbnetposition',
    config: {
        
		items: [{
				html: '<h2 class="rm-hearderbg">NET POSITION YEAR TO DATE</h2>'
			},{
				itemId: 'cont'
		}]
    },
	    
	setViewData: function(data){
        
        /*if (!RM.PermissionsMgr.canView('PAndLReport')) {
            this.getComponent('cont').setHtml('<div class="rm-dashboard-nodata">' + RM.Consts.NoAccessMsg + '</div>');            
            return;
        }*/
        
		this.getComponent('cont').setHtml( 
        
            '<div class="rm-panelboard">'+
            '<table cellspacing="0" cellpadding="0" width="100%">'+
            '<tr>'+
            '<td width="48%">'+
            '<div class="rm-dashboardnetposition">Income</div>'+            	
        	'<div class="rm-netposition-income">' + RM.AppMgr.formatCurrency(data.NetPositionIncome, 2, true) + '</div>'+        	
        	'<div class="rm-dashboardnetposition">Expenses</div>'+     
            '<div class="rm-netposition-expenses">' + RM.AppMgr.formatCurrency(data.NetPositionExpenses, 2, true) + '</div>'+        	
        	'</td>'+
            '<td width="4%"><div class="rm-equalicon">=</div></td>'+
            '<td width="48%"><div class="rm-totalamount">' + RM.AppMgr.formatCurrency(data.NetPositionIncome - data.NetPositionExpenses, 2, true) + '</div></td>'+
            '</tr>'+
            '</table>'+
            '</div>' 
        );
	}
});