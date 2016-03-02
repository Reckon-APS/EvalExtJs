Ext.define('RM.component.ChooseInvoiceDiscount', {

    requires: ['Ext.form.FieldSet', 'Ext.field.Radio'],

    initialize: function () {
        this.popup = null;

    },

    show: function (val, cb, cbs, title) {
        var me = this;
        this.title = title ? title : 'discount';
        RM.ViewMgr.regBackHandler(this.hide, this);        
        this.popup = Ext.create('RM.component.Popup', {
            items: [{
                xtype: 'component',
                html: 'Choose ' + this.title,
                cls: 'rm-title'
            },/* {
                xtype: 'fieldset',                
                defaults: {
                    xtype: 'radiofield',                    
                    listeners: {
                        check: function (checkBox) {
							
                        },
                        tap: { //allow tapping anywhere including label to fire check event, including when already checked
                            element: 'element', //"label",
                            fn: function (element) {                               
                                
                                var disc = this.getItemId();
                                if (disc == 5 || disc == 10 || disc == 20)
                                    disc = disc + '%';
                                cb.call(cbs, disc);
                                setTimeout(function () { me.popup.hide(); }, 200);
                            }
                        },
                        scope: this
                    },                    
                    labelAlign: 'left',
                    labelWidth: '80%'
                },
                items: [ 
                        {
                            name: 'disc',
                            itemId: '5',
                            label: '5%',
                            checked: (val == '5%')
                        }, {
                            name: 'disc',
                            itemId: '10',
                            label: '10%',
                            checked: (val == '10%')
                        }, {
                            name: 'disc',
                            itemId: '20',
                            label: '20%',
                            checked: (val == '20%')
                        }, {
                            name: 'disc',
                            itemId: 'custom',
                            label: 'CUSTOM % OR $',
                            checked: (val != 0 && val != '5%' && val != '10%' && val != '20%')
                        }, {
                            name: 'disc',
                            itemId: '0', //could have put in value, but cb.getValue() above always returns true
                            label: 'NONE',
                            checked: (val == 0)
                        }
					]
            }*/
            {
                xtype: 'list',
                itemId: 'optionslist',
                height: '13.45em',    
                itemTpl: '{title}',                
                data: [
                	//update highlightRow function if there is a change in array items
                    { title: '5%', itemId: '5' },
                    { title: '10%', itemId: '10' },
                    { title: '20%', itemId: '20' },
                    { title: 'CUSTOM % OR $', itemId: 'custom' },
                	{ title: 'NONE', itemId: '0'}
                ],
                listeners: {
                        itemtap: function (dataview, index, target, record) {                              
                            	var disc = record.data.itemId;
                                if (disc == 5 || disc == 10 || disc == 20 ){
                                     disc = disc + '%';
                                }                                   
                                cb.call(cbs, disc);
                                setTimeout(function () { me.popup.hide(); }, 200);
                        },                       
                        scope: this
                    },  
                
            }

			]

        });
        this.highlightRow(val);		//comment out this line if radiofield menu is used, this one is to highlight selection in list
        this.popup.show();
    },
    
    highlightRow: function(val){
        var optionslist = this.popup.down('#optionslist');
        var options = optionslist.getData();  
        if(!val){
            optionslist.select(4);  //NONE 
            return;
        }
        for(var i=0; i <options.length; i++){
            if(options[i].itemId + '%' == val){
                optionslist.select(i);			//5%, 10%, 20% 
                return;
            }
        }
        optionslist.select(3);		//CUSTOM % OR $
    },

    hide: function () {
        RM.ViewMgr.deRegBackHandler();
        this.popup.hide();
    }
});