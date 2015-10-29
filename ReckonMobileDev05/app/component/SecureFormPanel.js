/*
* An extension of a normal Ext.form.Panel make all of its child fields readonly and remove any placeholders 
* (if they support these settings) automatically based on it's permissions config
*
* Example: The default config will require AddEdit permissions on the item specified under 'permissionFor'
*         {
*               xtype: 'secureformpanel',
*               permissionFor: 'Contacts',
*               itemId: 'contactForm',	
*        } 
*
*/
Ext.define('RM.component.SecureFormPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'secureformpanel',
    
    config : {
        permissionFor : '',
        listeners: {painted : function () {this.checkPermissions();}} 
    },    

    checkPermissions: function() {
        // If there is a editAction specified, make sure the user has access to it, otherwise make all fields readonly
        var actionTarget = this.getPermissionFor();
        if(actionTarget && !RM.core.PermissionsMgr.canAddEdit(actionTarget)) {
            this.addEditDenied = true;
            // Iterate over all form fields and make them ReadOnly, and remove any placeholder text
            this.getFieldsArray().forEach(function(field) {
                if(field.setReadOnly) { field.setReadOnly(true); }
                if (field.setPlaceHolder) { field.setPlaceHolder(''); }
                // To set readonly on custome selector component
                field.config.rmlocked = true;
            });
        }
        
        // If any field has its own permissions, apply those too
        this.getFieldsArray().forEach(function(field) {                       
            var fieldPermission = field.config.permissionFor;
            if(fieldPermission) {
                var granted = RM.PermissionsMgr.canDo(fieldPermission.name, fieldPermission.action);
                if(fieldPermission.invoke) {
                    field[fieldPermission.invoke].apply(field, [granted]);    
                }
                else if(fieldPermission.invokeWithInverse) {
                    field[fieldPermission.invoke].apply(field, [!granted]);    
                }
                else {
                    field.setHidden(!granted);
                }                
            }
        });
    },    
    
    /* 
        Methods below were moved from RMPhoneField as a temp solution to stop the scroll flicker when going between fields        
        This should later be refactored and moved to more of an app wide approach that manages app wide keypad and virtual cursor, etc and extended to other fields
        At the moment this is used in the contact detail screen
    
    */
    scrollShowField: function(field, eleId, keypadType, cb){
        
        if(this.keyCb && this.keyFldEleId !== eleId){
            this.keyCb.onFieldLostFocus.call(this.keyCb);
        }
        
        this.keyFldEleId = eleId;
        
        this.keyCb = cb;
        var me = this;
        me.clearScrollTimer();
        me.scrollTimer = window.setTimeout(function() {
            me.scrollTimer = null;
            me.getScrollable().getScroller().scrollTo(0, field.element.dom.offsetTop, true);                                            
        }, 300);         
        
        this.showKeyPad(keypadType);
    },
    
    showKeyPad: function(keypadType){
        
        if(!this.keypad){
            this.rootContainer = this.getRootContainer(this);
            
            //set tap Listener on root container
            this.rootContainer.element.on({
                tap: this.handleTapInEntireScreen,
                scope: this
            });              
        }
        
        if(!this.keypad || keypadType !== this.keypadType){
            var keypad = {
                xtype:'dataentrykeypad',        
                docked: 'bottom',
                keypadType: keypadType,
                listeners: {
                    keytap: this.onKeyTap,
                    scope: this
                }
            };        

            this.keypad = this.add(keypad);        
        }
        else{
            this.keypad.show();
        }
        
        this.keypadType = keypadType;
        
        RM.ViewMgr.regBackHandler(this.hideKeypad, this);
    },
    
    hideKeypad: function(){
        this.keypad.hide();
        this.scrollTop();
        this.keyCb.onFieldLostFocus.call(this.keyCb);
        
        RM.ViewMgr.deRegBackHandler();
    },
    
    onKeyTap: function(key){
        this.keyCb.onKeyTap.call(this.keyCb, key);
        
        if(key === 'done'){            
            this.hideKeypad();
            //return;
        }
        if(key === 'cancel'){
            //this.setValue(this.revertBackVal);
            this.hideKeypad();            
            //return;
        }
        
    },
    
    handleTapInEntireScreen: function(e) { 
        if (this.keyCb && this.keyFldEleId !== e.target.id) {           
            this.keyCb.onFieldLostFocus.call(this.keyCb);
            this.hideKeypad();
            this.keyCb = null;
        }
    },        
    
    getRootContainer: function(owningPanel) {
        while (owningPanel.getParent()) {  
            owningPanel = owningPanel.getParent();
        }
        return owningPanel;
    },    
    
    scrollTop: function(){
        var me = this;
        me.clearScrollTopTimer();            
        if(!me.scrollTimer){
            this.scrollTopTimer = window.setTimeout(function() {                                            
                 me.getScrollable().getScroller().scrollTo(0, 0, false);                                            
            }, 300);
        }           
    },
        
    clearScrollTimer: function(){
        if(this.scrollTimer){
            window.clearTimeout(this.scrollTimer)
        }        
    },
    
    clearScrollTopTimer: function(){
        if(this.scrollTopTimer){
            window.clearTimeout(this.scrollTopTimer)
        }        
    }       
});