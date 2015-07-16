Ext.define('RM.component.PinKeypad', {
    extend: 'Ext.Panel',
    
    requires: ['Ext.Button'],
    
    xtype: 'pinkeypad',
    
    config: {
		control: {
			'button': {
				release: 'onKeyTap'
			}
		}
    },
	
    initialize: function() {
		this.callParent(arguments);
        this.pin = '';
		this.pinPosn = 0;
		this.add({
			xtype: 'container',
			height: 100,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			defaults: {xtype: 'component', cls:'rm-pincode', width: 34, height: 25, margin: 10, padding:18 },
			items: [{},{},{},{}]
		});
		
		this.add([{
			xtype: 'container',
			layout: 'hbox',
			defaults: { xtype: 'button', flex: 1, height: 60, cls: 'rm-flatkeypadbutton rm-border-top-2px' },
			items:[{
					text: '1'
				},{
					text: '2'
				},{
					text: '3'
				}
			]
		},{
			xtype: 'container',
			layout: 'hbox',
			defaults: {xtype: 'button', flex: 1, height: 60, cls: 'rm-flatkeypadbutton'},
			items:[{
					text: '4'
				},{
					text: '5'
				},{
					text: '6'
				}
			]
		},{
			xtype: 'container',
			layout: 'hbox',
			defaults: {xtype: 'button', flex: 1, height: 60, cls: 'rm-flatkeypadbutton'},
			items:[{
					text: '7',					
				},{
					text: '8'
				},{
					text: '9'
				}
			]
		},{
			xtype: 'container',
			layout: 'hbox',
			defaults: {xtype: 'button', flex: 1, height: 60, cls: 'rm-flatkeypadbutton'},
			items:[{
					text: ''
				},{
					text: '0'
				},{					       
                    cls: 'rm-flatkeypadbutton rm-flatkeypad-crossbtn'             
				}
			]
		}]);
    },


    clearPin: function(){
        var pinContainer = this.getComponent(0);
        
        for(var i = 0; i < 4; i++){
            var pinField = pinContainer.getComponent(i);
		    if(this.getInitialConfig('maskPin')){
			    pinField.removeCls('rm-pincode-entered');
            }
		    else{            			
			    pinField.setHtml('');
            }
        }

        this.pin = '';
        this.pinPosn = 0;
    },

	onKeyTap: function(btn){
        var txt = btn.getText();
        if(txt != ''){
            var pinContainer = this.getComponent(0);
            txt = (txt == null) ? 'x' : txt
            if(txt != 'x'){                
                if(this.pinPosn < 4){
		            var pinField = pinContainer.getComponent(this.pinPosn++);
		
		            if(this.config.maskPin)
			            pinField.addCls('rm-pincode-entered');
		            else			
			            pinField.setHtml(txt);

                    this.pin += txt;
                    if(this.pinPosn == 4)
                        this.fireEvent('pinentered', this.pin);
                }
			}
            else if(this.pinPosn > 0){
                this.pin = this.pin.slice(0, -1);
                var pinField = pinContainer.getComponent(--this.pinPosn);
		        if(this.config.maskPin)
			        pinField.removeCls('rm-pincode-entered');
		        else			
			        pinField.setHtml('');
            }
            this.fireEvent('keytap', txt);
        }
		    
	}
	

});