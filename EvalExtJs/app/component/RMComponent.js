Ext.define('RM.component.RMComponent', { 
    override: 'Ext.Component',     
    requires: ['RM.util.Device'],
    
    show: function (animation) { 
        return RM.Device.supportsAnimations() ? this.callParent(arguments) : this.callParent([false]); 
    }, 
    
    hide: function (animation) { 
        return RM.Device.supportsAnimations() ? this.callParent(arguments) : this.callParent([false]); 
    } 
}); 