/*
* An extension of a normal Ext.Button control that will hide and show itself automatically based on it's permissions config
*
* Example: The default config will require AddEdit permissions on the item specified under 'permissionFor'
*         {
*            xtype: 'securebutton',
*            permissionFor: 'Contacts',
*        	text: 'ADD',
*        	itemId: 'add'	
*        } 
*
* Example 2: The 'permissionFor' config can also be given a specific action and target to verify if necessary
*        {
*            xtype: 'securebutton',
*            permissionFor: { name:'Contacts', action:'View' },
*    		text: 'OPEN',
*    		itemId: 'openContact'                            	
*    	}
*
*/
Ext.define('RM.component.SecureButton', {
    extend: 'Ext.Button',
    xtype: 'securebutton',
    
    config : {
        permissionFor : '',
        hidden: true,
        listeners: {painted : 'checkPermissions'} 
    },
    
    initialize: function() {
       this.callParent(arguments);        
       RM.AppMgr.application.on( {'rm-permissionsupdated' : this.checkPermissions, scope : this} );
       this.checkPermissions();
    },
    
    checkPermissions: function() {
        // If there is a permissionFor setting specified, make sure the user has access to it, otherwise hide the control
        var permissionRequired = this.getPermissionFor();
        if (!permissionRequired) { return; }
        
        var accessGranted = false;
        if (typeof(permissionRequired) === 'string') {
            accessGranted = RM.core.PermissionsMgr.canAddEdit(permissionRequired);
        }
        else {
            accessGranted = RM.core.PermissionsMgr.canDo(permissionRequired.name, permissionRequired.action);
        }
        
        if (accessGranted) { this.show(); }
        else { this.hide(); }
    }
});