Ext.define('RM.component.ExtNumberField', {
    extend: 'Ext.field.Number',
    xtype: 'extnumberfield',

    initialize: function () {
        
        this.callParent(arguments);
        
        if(this.config.rmmandatory){
            this.setLabel(this.getLabel() + ' <span style="color: #F00">*</span>');    
        }
        
        this.on('keyup',this.valChange); 
        this.on('blur', this.numberPrecision);
        this.on('disabledchange', function (field, value) {
            value ? field.addCls(['rm-flatfield-disabled']) : field.removeCls(['rm-flatfield-disabled']);
        }, this);
    },
    
    showValidation: function(valid){        
         this.setLabelCls(valid ? '' : 'rm-manfld-notset-lbl');
    },
    
    setValue: function(){
        this.callParent(arguments);
        this.showValidation(true);
    },
    
    reset: function(){
        this.callParent(arguments);
        this.setLabelCls('');
    },
    
    valChange: function(comp, e, eOpts){
        var val = this.getValue(); 
        //console.log(e.browserEvent.keyCode);
        if (!(47<e.browserEvent.keyCode<58 || e.browserEvent.keyCode == 190)) {
            e.stopEvent();
        }
        if(val === null || val === undefined ) {            
            //console.log(val);
            return;
        }   
        
        var valStr = val.toString(); 
        var valStrLen = valStr.length;
        
        if(this.config.decimalPlaces && valStr.indexOf('.') != -1){
            if( valStrLen-1 > ( valStr.indexOf('.') + this.config.decimalPlaces ) ){
                this.setValue(valStr.substring(0,valStrLen-1));
            }
        } 
        //console.log(this.getValue());
    },
    
    numberPrecision: function (value) {        
        if (Ext.isNumber(value) && Ext.isNumber(this.config.decimalPlaces)) {
            this.setValue(value.toFixed(this.config.decimalPlaces));
        }
    },
    
    getValue: function(){        
        this.showValidation(true);
        return this.callParent(arguments);      
    } 

});