Ext.define('RM.component.DurationField', {
    extend: 'RM.component.ExtTextField',
    xtype: 'durationfield',
    requires: 'RM.component.DurationPicker',

    initialize: function () {        
        this.callParent(arguments);
        this.duration = 0;       
        this.on('tap', function () {            
            RM.Selectors.showDurationPicker(this);
        }, this);
        this.on('disabledchange', function (field, value) {
            value ? field.addCls(['rm-flatfield-disabled']) : field.removeCls(['rm-flatfield-disabled']);
        }, this);
    },

    constructor: function (config) {        
        config.clearIcon = false; 			
        config.readOnly = true;
        this.callParent(arguments);
    },    

    setValue: function (duration) { 
        duration ? this.showValidation(true) : this.showValidation(false);        
        this.duration = duration;        
        var valueInField =  RM.AppMgr.minsToTime(duration);        	
        this.callParent([valueInField]);              
    },

    getValue: function () {        
        return this.duration;   
    }

});
