Ext.define('RM.component.CalcKeypad', {
    extend: 'Ext.Panel',    
    requires: ['Ext.Button'],    
    xtype: 'calckeypad',    
    config: {
		control: {
			'button': {
				tap: 'onKeyTap'
			}
		},
		
        items: [        
            {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                            {
                                xtype: 'container',
                                flex: 1,
                                layout: 'hbox',
                                items: [
                                    
                                            {
                                				xtype:'container',
                                				flex: 1,
                                				defaults: {xtype:'button', height: 50, cls: 'rm-flatkeypadbutton'},
                                				items:[{
                                						text: '1'				
                                					},{
                                						text: '4'					
                                					},{
                                						text: '7'					
                                					},{                        
                                                        text: '.'
                                                    }
                        				      ]
                        			        },
                                            {
                                				xtype:'container',
                                				flex: 1,
                                				defaults: {xtype:'button', height: 50, cls: 'rm-flatkeypadbutton'},
                                				items:[{
                                						text: '2'				
                                					},{
                                						text: '5'					
                                					},{
                                						text: '8'					
                                					},{                        
                                                        text: '0'
                                                    }
                                				]
                        			        }
                                                    
                
                            ] 
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            items: [
                                       {
                                           xtype: 'container',
                                           layout: 'hbox',
                                           items: [
                                                       {
            			                            
    														xtype:'container',
    														flex: 1,
    														defaults: {xtype:'button', height: 50, cls: 'rm-flatkeypadbutton'},
    														items:[
    																	{
    																		text: '3'				
    																	},{
    																		text: '6'					
    																	},{
    																		text: '9'					
    																	}
    														]
    													},
                                                       {
                                                        xtype:'container',
                                        				flex: 1,
                                        				defaults: {xtype:'button', height: 50, cls: 'rm-flatkeypadbutton'},
                                        				items:[
                                        						{
                                        							cls: 'rm-flatkeypadbutton rm-flatkeypad-backspace',
                                                                    itemId: 'back'
                                        						},{
                                        							text: '+'					
                                        						},{
                                        							text: 'x'					
                                        						}
                                        				]
                                                    } 
    											]
        								},
                                        {
                                            xtype: 'button',
                                            height: 50, 
                                            cls: 'rm-flatkeypadbutton',
                                            text: '='
                                        }                                             
                                   ]
                       } 
                      ]
             }
        ]           
    },        
    
	
	onKeyTap: function(btn){        
	    this.fireEvent('keytap', btn.getText() ? btn.getText().toLowerCase() : btn.getItemId().toLowerCase());	
	}

});