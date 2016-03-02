/*
*    A select field for selecting from a list which is on another screen    
*
*    Note:    This has only been partially implemented so far to handle preventing the OS keypad appearing.
*             Later look at combining into this comnponent the associated hidden field id and which selector screen to show
*
*/
Ext.define('RM.component.RMSelectScreenField', {
    extend: 'RM.component.ExtTextField',
    xtype: 'rmselectscreenfield',
    
    config : {
        //clearIcon: true
    },
    
    //Override Ext.field.Text onFocus() method to prevent OS keypad showing using code taken from Ext.field.DatePicker    
    onFocus: function(e) {
        var component = this.getComponent();
        this.fireEvent('focus', this, e);

        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();

        if (this.getReadOnly()) {
            return false;
        }

        this.isFocused = true;

    }

});