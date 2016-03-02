Ext.define('RM.component.RMCheckbox', {
    extend: 'Ext.Container',
    xtype: 'rmcheckbox',

    config: {
        layout: 'hbox',  
        //padding: '18 5 18 5',        
    },

    initialize: function () {
        var me = this;
        this.callParent();
        this.val = this.config.value;
        if(this.config.leftAlignCheckbox){
             this.add([{
                            xtype: 'component',                            
                            html: '<div class= "rm-checkbox rm-checkbox-off"></div>',
                            listeners: {
                                tap: {
                                    element: 'element',                    
                                    fn: function () { me.toggleCheckMark(); }
                                }
                            }
                        },{
                            xtype: 'component',                            
                            html: '<div class="'+this.config.labelCls+' || rmcheckbox-label">' + this.config.text + '</div>',
                            listeners: {
                                tap: {
                                    element: 'element',                    
                                    fn: function () { me.toggleCheckMark(); }
                                }
                            }                            
                        } 
    		    ]);   
        }
        else{             
             this.add([{
                            xtype: 'component',
                            html: '<div class="'+this.config.labelCls+' || rmcheckbox-label">' + this.config.text + '</div>',
                            listeners: {
                                tap: {
                                    element: 'element',                    
                                    fn: function () { me.toggleCheckMark(); }
                                }
                            }
                        }, {
                            xtype: 'component',
                            html: '<div class= "rm-checkbox rm-checkbox-off"></div>',
                            listeners: {
                                tap: {
                                    element: 'element',                    
                                    fn: function () { me.toggleCheckMark(); }
                                }
                            }
                        }
    		    ]);
        }
        
    },

    toggleCheckMark: function () {
        this.val = !this.val;        
        this.setCheckBoxState();
        this.fireEvent('check', this.val);
    },

    getValue: function () {
        return this.val;
    },

    setValue: function (boolVal) {
        this.val = boolVal;
        this.setCheckBoxState();
        this.fireEvent('check', this.val);
    },

    setCheckBoxState: function () {
        var checkbox;
        if(this.config.leftAlignCheckbox){
            checkbox = this.getComponent(0);
        }
        else{
           checkbox = this.getComponent(1);
        }
        
        if (this.val) {
                checkbox.setHtml('<div class= "rm-checkbox rm-checkbox-on"></div>');
        }
        else {
                checkbox.setHtml('<div class= "rm-checkbox rm-checkbox-off"></div>');
        }
        
    }

});