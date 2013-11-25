Ext.define('RM.controller.DashboardC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
			netPosition: 'dashboard dbnetposition',
			alerts: 'dashboard dbalerts',
			topExpenses: 'dashboard dbtopexpenses',
			budgetOverview: 'dashboard dbbudgetoverview',
            dashboardCont: 'dashboard #cont',
            noaccessCont: 'dashboard #noaccesscont',
            refresh: 'dashboard #refresh'
        },
        control: {
			'dashboard': {
                //contready: 'loadItems'
                show: 'onShow'
            },            
			'refresh': {
                tap: 'refreshDashboard'
            }	
        }

    },
    
    init: function() {
       this.callParent();        
       RM.AppMgr.application.on( {'rm-permissionsupdated' : this.showDashboardData, 'itemupdated': this.onItemUpdated, scope : this} );        
    },
    
    showView: function(dashboardData){
        this.dashboardData = dashboardData;
        this.showDashboardData();
    },    
    
    onShow: function(){
        if(this.needsRefresh) {
            this.refreshDashboard()
        }
        else {
            this.showDashboardData();
        }        
    },
    
    onItemUpdated: function() {
        this.needsRefresh = true;
    },
    
    refreshDashboard: function(){
        RM.AppMgr.getServerRecs('Dashboard', null,
            function(recs){
                this.needsRefresh = false;
                this.dashboardData = recs[0];
                this.showDashboardData();                
            },
            this            
        );
    },    
    
    showDashboardData: function(){ 
        var canViewNetPosition = RM.PermissionsMgr.canView('PAndLReport');
        var canViewAlertsInvoices = RM.PermissionsMgr.canView('Invoices');
        var canViewAlertsBills =  RM.PermissionsMgr.canView('Bills');
        var canViewTopExpenses = RM.PermissionsMgr.canView('TopExpenseAccountsReport');
        var canViewBudgets = RM.PermissionsMgr.canView('Budgets');
        
        //For no access to all components
        if(this.getNoaccessCont()) this.getNoaccessCont().setHidden(canViewNetPosition || canViewAlertsInvoices || canViewAlertsBills || canViewTopExpenses || canViewBudgets);
        
        if(this.getDashboardCont()){
            if(canViewNetPosition){
                this.getNetPosition().setViewData(this.dashboardData);
            } 
            if(canViewAlertsInvoices || canViewAlertsBills){
                this.getAlerts().setViewData(this.dashboardData);
            }
            if(canViewTopExpenses){
                this.getTopExpenses().setViewData(this.dashboardData.TopExpenses);  
            }        	
        	if(canViewBudgets){
               this.getBudgetOverview().setViewData(this.dashboardData.BudgetOverview); 
            } 
            this.getNetPosition().setHidden(!canViewNetPosition);
            this.getAlerts().setHidden(!(canViewAlertsInvoices || canViewAlertsBills));
            this.getTopExpenses().setHidden(!canViewTopExpenses);  
            this.getBudgetOverview().setHidden(!canViewBudgets);        	
        }         
    }   

});