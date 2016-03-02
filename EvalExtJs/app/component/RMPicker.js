Ext.define('RM.component.RMPicker', {
    override: 'Ext.picker.Picker',
    
    delayedCalls: {},
    
    initialize: function() {
        // Wow - this is to make sure that the picker remains hidden until it's explicitly shown, so that we can delay the display if needed.
        if (Ext.os.is.Android) this.setHidden(true);
        this.callParent(arguments);         
    },
    
    // Egregious, I know. Monkey patching the picker button handler so we can delay the default behaviour by enough time for the 
    // extra click event to be absorbed by the picker and not the underlying form. Affects android only.
    onDoneButtonTap: function(button, e) {
        if(!this.delayRequired()) {
            // resume click event executing
            this.callParent(arguments);
            return;
        }
        
        // Delaying the done button click handling by 250 ms to give the ghost click time to fire and be eaten.
        // This approach is weird (noDelay etc in a recursive call), but required for the Ext callParent method to work. The caller HAS to be this 
        // method in this class.
        this.callDelayed(this.onDoneButtonTap, arguments, 300);
    },
    
    show: function() {
        // Make sure the keypad buggers off
        if(Ext.os.is.Android) RM.ViewMgr.hideKeyPad();
        
        if(!this.delayRequired()) {            
            this.callParent(arguments);
            return;
        }
        
        this.callDelayed(this.show, arguments, 350);
    },
    
    delayRequired: function() {
        if(!Ext.os.is.Android || this.noDelay) {
            return false;
        }
        return true;
    },
    
    callDelayed: function(target, args, delay) {
        var that = this;       
        
        // If multiple calls come through for the same method, only call it once after the delay is through.
        if(this.delayedCalls[target.$name]) return;
        
        console.log('Delaying a call to "' + target.$name + '"');
        this.delayedCalls[target.$name] = true;
        setTimeout(function() {
            console.log('Resuming call to "' + target.$name + '"');
            that.noDelay = true;
            target.apply(that, args);
            that.noDelay = false;
            that.delayedCalls[target.$name] = false;
        }, delay);
    }
});