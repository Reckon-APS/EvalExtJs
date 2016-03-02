/*
* An extension of a normal Ext.Panel makes all of its child fields invisible if the requisite permission cannot be confirmed
*
* Example: The default config will require View permissions on the item specified under 'permissionFor'
*         {
*               xtype: 'secureformpanel',
*               permissionFor: 'Contacts'
*        } 
*
*/
Ext.define('RM.component.SecurePanel', {
    extend: 'Ext.Panel',
    xtype: 'securepanel',
    
    config : {
        permissionFor : '',
        listeners: {painted : function () {this.checkPermissions();}} 
    },    
    
    checkPermissions: function() {
        // If there is a editAction specified, make sure the user has access to it, otherwise make all fields readonly
        var actionTarget = this.getPermissionFor();
        if(actionTarget && !RM.core.PermissionsMgr.canView(actionTarget)) {
            RM.AppMgr.showErrorMsgBoxOpaque('You are not permitted to view this screen', function() {
                RM.ViewMgr.back();
            },
            this);            
        }
    }
});