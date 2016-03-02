Ext.define('RM.component.ExtEmailField', {
    extend:'Ext.field.Email',
    xtype: 'extemailfield',  
    mixins: { visibleOnFocus: 'RM.component.VisibleOnFocus' },
    
    initialize: function () {
        
        this.callParent(arguments);
        
        if(this.config.rmmandatory){
            this.setLabel(this.getLabel() + ' <span style="color: #F00">*</span>');    
        }
        this.on('disabledchange', function (field, value) {
            value ? field.addCls(['rm-flatfield-disabled']) : field.removeCls(['rm-flatfield-disabled']);
        }, this);
        this.mixins.visibleOnFocus.constructor.call(this);
    },    
    
    showValidation: function(valid){        
         this.setLabelCls(valid ? '' : 'rm-manfld-notset-lbl');
    },
    
    reset: function(){
        this.callParent(arguments);
        this.setLabelCls('');
    },
    
    getValue: function(){        
        this.showValidation(true);
        return this.callParent(arguments);      
    } 
    

})