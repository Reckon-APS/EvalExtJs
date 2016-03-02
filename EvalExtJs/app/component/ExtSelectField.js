Ext.define('RM.component.ExtSelectField', {
    extend:'Ext.field.Select',
    requires: ['RM.component.RMPicker'],
    xtype: 'extselectfield',
    
    initialize: function () {         
        this.callParent(arguments);        
        if(this.config.rmmandatory){
            this.setLabel(this.getLabel() + ' <span style="color: #F00">*</span>');    
        } 
        
        this.element.on('tap', 
            function (e) { 
                if(Ext.fly(e.target).hasCls('x-clear-icon')){
                    this.setValue(null);
                }
            }, 
            this
        );
        this.on('disabledchange', function (field, value) {
            value ? field.addCls(['rm-flatfield-disabled']) : field.removeCls(['rm-flatfield-disabled']);
        }, this);

        var fieldPicker = this.getPhonePicker();
        if(fieldPicker){
            fieldPicker.setListeners(
            {                
                show: function(picker){
                    RM.ViewMgr.regBackHandler(picker.hide, picker);
                },
                hide: function(){
                    RM.ViewMgr.deRegBackHandler();    
                },
                scope: this           
            });
        }        
    },
    
    onPickerChange : function() {
        this.callParent(arguments);
        //add a new event to fire when an item was actually selected
        this.fireEvent('itemselected', this);
    },
    
    showValidation: function(valid){        
         this.setLabelCls(valid ? '' : 'rm-manfld-notset-lbl');
    },
    
    setValue: function(){
        this.callParent(arguments);
        this.showValidation(true);
        //add a new event to fire when an item is actually loaded in the field
        //this event is useful when we want to hide clear icon as setClearIcon(false) does not hide the clear icon
        this.fireEvent('itemloaded', this);
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