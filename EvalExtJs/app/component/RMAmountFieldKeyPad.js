Ext.define('RM.component.RMAmountFieldKeyPad', {
    extend: 'RM.component.ExtTextField',
    xtype: 'rmamountfieldkeypad',
    requires: ['RM.component.DataEntryKeypad'],
    
    constructor: function(config) {          
        this.isInitializing = true;
        this.readOnlyField = config.readOnly || false;     
        config.trailingZerosUpTo = config.trailingZerosUpTo == 0 || config.trailingZerosUpTo ? config.trailingZerosUpTo : 2;
        config.prefix = config.prefix || '';
        config.readOnly = true;
        this.callParent(arguments);        
    },
    
    initialize: function () {        
        this.callParent(arguments);      
        this.on('tap', this.onFieldFocus, this);         
        this.setReadOnly(true);
        this.isInitializing = false;
    },

    onFieldFocus: function(field, e) {   
        if(this.fieldMaskEl) this.clearCursorBlinkTimer();
        if (this.readOnlyField) {
            return;     
        }               
        //console.log(this.getId() + ' onFieldFocus');
        this.fieldMaskEl = e.target.nextElementSibling;
        this.showCursor();        
        //this.fieldUniqueId = e.target.id;       
        this.inEditMode = true;
        //get field's owner panel
        this.owningPanel = field.up('panel');         
        
        this.revertBackVal = this.getValue();
        this.owningPanel.scrollShowField(field, e.target.id, 'amount', this);
    },
    
    onFieldLostFocus: function(){
        this.inEditMode = false;
        //console.log(this.getId() + ' onFieldLostFocus');
        this.clearCursorBlinkTimer();
        
        var val = this.getValue();
        
        if (val == '.')
            val = '0.0';           
        if (this.config.decimalPlaces && val != '') {               
            this.setValue(this.config.prefix + this.formatVal(val));
        }
        this.fireValueChangeEvent(val);
    },    
    
    onKeyTap: function (key) {  
        if (key === 'bar') {
            return;
        } 
        if (key === 'done') {            
            //this.removeKeypad();
            return;
        }
        if (key === 'cancel') {
            this.setValue(this.revertBackVal);
            //this.removeKeypad();            
            return;
        }
        
        var val = this.getValue();
        var valStr = this.config.prefix + val.toString();
        var valStrLen = valStr.length;  
        var pointIndex = valStr.indexOf('.');        
               
        if (key === 'backspace') {
            if (valStrLen > 0) {
                valStr = valStr.slice(0, -1);
                this.setValue(valStr);                
            }            
        } 
        else {
            if (this.config.decimalPlaces) {
                if ((key != '.' && valStrLen - 1 < pointIndex + this.config.decimalPlaces) || pointIndex < 0) {
                    if (valStr == this.config.prefix + '0' && key != '.') {
                        valStr = this.config.prefix;  
                    }                                      
                    this.setValue(valStr + key);
                }
            }
            else {                
                if (pointIndex != -1 && key == '.') {
                    return;
                }                    
                if (valStr == this.config.prefix + '0') {
                    valStr = this.config.prefix;
                }                     
                this.setValue(valStr + key);
            } 
        }
    },   
    
    //Overridden getValue to remove prefix
    getValue: function() {
        var val = this.callParent();
        var valStr = val.toString();        
        if(this.config.prefix){
            valStr = valStr.replace(/,/g,'');
        }
        if (this.config.prefix && valStr.indexOf(this.config.prefix) != -1) {
            valStr = valStr.slice(this.config.prefix.length);            
        }         
        return valStr;
    },    
    
    //To format value when loading the form
    applyValue: function(newVal, oldVal) {          
        var valStr = newVal ? newVal.toString() : '';  
        if (!oldVal && oldVal !== '') {
            this.valBeforeChange = valStr;        //store original value of the field for valueChange Event
            if (this.config.decimalPlaces && valStr !== '') {
                //valStr = Ext.Number.toFixed(parseFloat(valStr), this.config.decimalPlaces);
                valStr = this.formatVal(valStr);
            }                
        }
        if (valStr.indexOf(this.config.prefix) == -1 && valStr !== '') {
            valStr = this.config.prefix + this.formatVal(valStr);       
        }
        if (!this.inEditMode) {            
            this.fireValueChangeEvent(newVal);
        }
        return valStr;
    },         
    
    showCursor: function() {        
        var me = this;         
        me.cursorBlinkTimer = window.setInterval(
            function() {  
                if (me.myCursorOff) {
                    me.fieldMaskEl.style.cssText = 'display: none !important;' 
                }
                else { 
                    me.fieldMaskEl.style.cssText = '' 
                }
                me.myCursorOff = !me.myCursorOff 
            }
            , 500);            
    },
    
    //clear cursor blink timer
    clearCursorBlinkTimer: function() {
        if (this.cursorBlinkTimer) {
            window.clearTimeout(this.cursorBlinkTimer)
        }
        this.fieldMaskEl.style.cssText = 'display: none !important;'
    },
    
    setReadOnly: function(value) {        
        this.callParent([true]); 
        if (this.isInitializing) {
            return; 
        }
        this.readOnlyField = value;
    },
    
    getReadOnly: function() {
        return this.readOnlyField;
    },
    
    //check for value change and fire valueChange Event
    fireValueChangeEvent: function(val) {      
        var valStr = val ? val.toString() : '';
        valStr = valStr.replace(/,/g,'');
        if (valStr.indexOf(this.config.prefix) != -1) {
            val = valStr.slice(this.config.prefix.length)
        }
        var newVal = parseFloat(val) || '';
        var oldVal = parseFloat(this.valBeforeChange) || '';        
        if (newVal != oldVal) {
            if(this.valBeforeChange !== undefined){
                this.fireEvent('valueChange', newVal, oldVal);                
            }
            this.valBeforeChange = newVal;            
        }
    },
    
    formatVal: function(val) {          
        var formattedValStr = parseFloat(val).toString();
        var pointPosition = formattedValStr.indexOf('.');
        if (pointPosition !== -1) {
            var digitsAfterPoint = formattedValStr.length - pointPosition - 1;
            var diff = this.config.trailingZerosUpTo - digitsAfterPoint;
            if (diff > 0) {
                for (i = 0; i < diff; i++) {
                    formattedValStr = formattedValStr + '0';
                }
            }
        }
        else if (this.config.trailingZerosUpTo > 0) {
            formattedValStr = formattedValStr + '.';
            for (i = 0; i < this.config.trailingZerosUpTo; i++) {
                formattedValStr = formattedValStr + '0';
            }
        } 
        
        //put commas for price field else return without commas
        if(this.config.prefix){
            if(formattedValStr.indexOf('.') != -1){
                var strArray = formattedValStr.split('.');
                strArray[0] = strArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                formattedValStr = strArray[0] + '.' + strArray[1];
                return formattedValStr;
            }
            else{
                return formattedValStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }            
        }
        else{
            return formattedValStr;
        }        
    }     
});