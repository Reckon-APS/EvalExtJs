Ext.define('RM.component.RMList', {
    extend: 'Ext.List',
    xtype: 'rmlist',
    requires: ['RM.component.RMPullRefresh', 'Ext.plugin.ListPaging'],    
    
    config: {
        
        plugins: [
            {
                xclass: 'RM.component.RMPullRefresh',                        
            },{
                type: 'listpaging',
                autoPaging: true,
                noMoreRecordsText: ''
            }
        ]       
    },
    
    initialize: function () {        
        this.callParent(arguments);        
        if (!this.config.emptyText) {
            this.config.emptyText = "No data found."; 
        }  
        this.setEmptyText('<div class = "rm-list-emptytext">' + this.config.emptyText + '</div></br>' +
                          '<div>' +
                          '<img src= "resources/images/rm-emptylist-arrow.svg" class= "rm-list-emptytext-img" align = "center"></img>' +
                          '<span class= "rm-list-emptytext-desc">Pull down to refresh</span>' +
                          '</div>'); 
    }
});