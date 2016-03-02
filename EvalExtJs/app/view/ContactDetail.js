Ext.define('RM.view.ContactDetail', {
	extend: 'RM.component.SecurePanel',
	requires: ['RM.component.SecureFormPanel', 'RM.component.SecureButton', 'RM.component.RMPhoneField', 'RM.component.RMToggleField', 'RM.component.RMMultiSelectField'],
	xtype: 'contactdetail',
    
	config: {		
        permissionFor: 'Contacts',
		layout: 'fit',        
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				items: [
					{
						ui: 'back',
						itemId: 'back',
						ui: 'rm_topbarbuttonleft',
						icon: 'resources/images/icons/rm-back.svg',
                        iconCls: 'rm-backbtniconcls',
						width: '2.6em'						
					},{
						xtype: 'component',						
						cls: 'rm-topbartitle',
						itemId: 'title'
					},{
						xtype: 'spacer'
					},{
                        xtype: 'securebutton',
						text: 'Save',
						itemId: 'save',	                        
						ui: 'rm_topbarbuttonright',
                        permissionFor: 'Contacts'
					}
				]
			},{
				xtype: 'secureformpanel',
                permissionFor: 'Contacts',
				itemId: 'contactForm',
				padding: 0,
                defaults:{xtype: 'exttextfield', labelWidth: 180, cls: 'rm-flatfield', placeHolder: 'enter', clearIcon: false},
				items: [
					{
						xtype: 'hiddenfield',
						name: 'ContactId'			
					},{
						name: 'Description',
						label: 'Display name',
                        maxLength: 100,
                        labelWidth: '8em',
                        rmmandatory: true
					},{
					    xtype: 'rmmultiselectfield',
					    name: 'CustomerOrSupplier',
						itemId: 'customerOrSupplier',
						label: 'Type of contact',
                        labelWidth: '9em',                        
                        options: [                            
                            {text: 'Customer', value: 'Customer'},
                            {text: 'Supplier', value: 'Supplier'}                        
                        ],                        
                        rmmandatory: true,                                          
                        placeHolder: 'choose'
                    },{
                        xtype: 'extselectfield',
                        cls: 'rm-flatfield', 
                        usePicker: true,
                        autoSelect: false,  
                        itemId: 'terms',
                        store: 'Terms',
                        displayField: 'TermName',
						valueField: 'TermID',
                        clearIcon: true,
                        label: 'Payment terms',
                        name: 'Terms',
                        placeHolder: 'choose',
                        labelWidth: '9em'                                
                    },
                    {
                        xtype: 'rmamountfield',
    					name: 'CreditLimit',                        
    					label: 'Credit limit',
    					placeHolder: 'enter',                                            
                        decimalPlaces: 2,
                        prefix: '$'
                    },
                    {
						xtype: 'extselectfield',
                        name: 'BusinessOrIndividual',
                        itemId: 'businessOrIndividual',
						label: 'Business or individual',
                        labelWidth: '13em',
                        options: [
                            {text: 'Business',  value: 'Business'},
                            {text: 'Individual', value: 'Individual'}                            
                        ],
                        rmmandatory: true,
						usePicker: true,						
                        autoSelect: false,                                        
						ui:'plain',
                        placeHolder: 'choose',
                        border: '1 0 1 0',
                        style: 'border-color: #DBDBDB; border-style: solid;'
			        },{
                        xtype: 'container',
                        itemId: 'detailsFields',
                        defaults:{xtype: 'exttextfield', labelWidth: 180, cls: 'rm-flatfield', placeHolder: 'enter', clearIcon: false},
                        border: '0 0 0 0',
                        hidden:true,
                        items: [{
                            xtype: 'component',
                            itemId: 'detailHeader',    
                            html: '<h3 class="rm-m-1 rm-hearderbg">Details</h3>'
    					},{
    						name: 'FirstName',
    						label: 'First name',
                            maxLength: 100,
                            labelWidth: '6em',
                            rmmandatory: true,                        
                            hidden: true
    					},{
    						name: 'Surname',                                       
    						label: 'Surname',
                            maxLength: 100,
                            labelWidth: '5.5em',
                            rmmandatory: true,
                            hidden: true
    					},{
    						name: 'BusinessName',
    						label: 'Business name',
                            maxLength: 100,
                            labelWidth: '8em',
                            rmmandatory: true,
                            hidden: true                        
    					},{
    						name: 'BranchName',                                       
    						label: 'Branch name',
                            maxLength: 100,
                            labelWidth: '7em',
                            hidden: true, 
                            border: '1 0 1 0'
    					}, {
    					    xtype: 'rmnumberfield',
    						name: 'ABN',                                       
    						label: 'ABN',
                            labelWidth: '10em',
                            maxLength: 30,
                            border: '1 0 1 0'
    					},{
                            xtype: 'container',
                            itemId: 'phoneContainer',                                        
                            layout: 'hbox',
                            items: [{                            
                                html: 'Phone',
                                flex: 1.5,
                                cls: 'x-form-label',
                                style: 'font-size: 80%; padding-top: 0.9em; padding-left: 0.7em;'
                            },{
                                xtype: 'rmphonefield',                             
                                cls: 'rm-flatfield',                             
                                name: 'PhoneAreaCode',						    
                                placeHolder: 'area code', 
                                maxLength: 20,
                                flex: 2.2,
                                clearIcon: false,
                                border: '0 1 0 1 ',
                                style: 'border-color: #DBDBDB; border-style: solid;'
                            },
                            {
                                xtype: 'rmphonefield', 
                                cls: 'rm-flatfield', 
                                placeHolder: 'enter',
                                maxLength: 20,
                                name: 'Phone',
                                flex: 3.5,
                                clearIcon: false,
                                border: '0 0 0 0 '                            
                            }]
    						
    					},{
                            xtype: 'container',
                            itemId: 'faxContainer',                                        
                            layout: 'hbox',
                            items: [{                            
                                html: 'Fax',
                                flex: 1.5,
                                cls: 'x-form-label',  
                                style: 'font-size: 80%; padding-top: 0.9em; padding-left: 0.7em;'
                            },{
                                xtype: 'rmphonefield',                             
                                cls: 'rm-flatfield',                             
                                name: 'FaxAreaCode',						    
                                placeHolder: 'area code',
                                maxLength: 20,
                                flex: 2.2,
                                clearIcon: false,
                                border: '0 1 0 1 ',
                                style: 'border-color: #DBDBDB; border-style: solid;'
                            },
                            {
                                xtype: 'rmphonefield', 
                                cls: 'rm-flatfield', 
                                placeHolder: 'enter',
                                maxLength: 20,
                                name: 'Fax',
                                flex: 3.5,
                                clearIcon: false,
                                border: '0 0 0 0 '                            
                            }]
    						
    					},{
                            xtype: 'extemailfield',
    						name: 'Email',  
    						label: 'Email',
                            maxLength: 100,
                            labelWidth: '4.5em'
    					},{                        
    						name: 'Web',  
    						label: 'Web',
                            maxLength: 100,
                            labelWidth: '4em'
    					},{
        					xtype: 'exttextfield',
        					name: 'Notes',
        					label: 'Notes',
                            labelWidth: 110,
                            labelWidth: '4em',
        					cls: 'rm-flatfield',                       
                            readOnly: true
    				    },
                        
                        {
                            xtype: 'container',
                            itemId: 'postalAddress',                             
                            defaults:{xtype: 'exttextfield', labelWidth: 180, cls: 'rm-flatfield', placeHolder: 'enter', clearIcon: false},
                            items: [{                            
                                    xtype: 'component',                                        
                                    itemId: 'addressHeader',
                                    layout: 'vbox',
                                    html: '<h3 class="rm-m-1 rm-hearderbg">Postal address</h3>'
                                	
                                },{
                                	 xtype: 'extselectfield',
                                     name: 'PostalAddress.Address',
                                     itemId: 'postalAddressSelectField',
                                     label: 'Address type',
                                	 options: [
                                        {text: 'National',  value: 1},
                                    	{text: 'International', value: 2}                                    	
                                    ]
                            	},{
                                    name: 'PostalAddress.Address1',                                        
                                    label: 'Line 1',
                                    maxLength: 80,
                                    labelWidth: '4.5em'
                                },{
                                    name: 'PostalAddress.Address2', 
                                    label: 'Line 2',
                                    maxLength: 80
                                },{
            						name: 'PostalAddress.Suburb',   
            						label: 'Suburb',
                                    maxLength: 80,
                                    labelWidth: '7.5em'
            					},{
            						name: 'PostalAddress.Town',   
            						label: 'Town/City',
                                    maxLength: 80,
                                    labelWidth: '7.5em'
            					},{
            						name: 'PostalAddress.State',  
            						label: 'State',
                                    maxLength: 80,
                                    labelWidth: '4em'
            					},{
            						name: 'PostalAddress.PostCode',
            						label: 'Postcode',
                                    maxLength: 30,
                                    labelWidth: '5em'
            					},{
            						name: 'PostalAddress.Country', 
            						label: 'Country',
                                    maxLength: 30,
                                    border: '1 0 1 0',
                                    labelWidth: '5.5em'                                    
            					}]    						
    					},
                        {
                            xtype: 'container',
                            itemId: 'businessAddress',   
                            defaults:{xtype: 'exttextfield', labelWidth: 180, cls: 'rm-flatfield', placeHolder: 'enter', clearIcon: false},
                            items: [{                            
                                xtype: 'component',                                        
                                itemId: 'addressHeader',                         
                                html: '<h3 class="rm-m-1 rm-hearderbg">Business address</h3>'
                                },{
                                    xtype: 'rmtogglefield',
                                    onText: 'Yes',
                                    offText: 'No',
                                    label: 'Same as postal',
                                    name: 'SameAddress',
                                    placeHolder: '',
                                    toggleState: false
                                },
                            	{
                                	 xtype: 'extselectfield',
                                     name: 'BusinessAddress.Address',
                                     itemId: 'businessAddressSelectField',
                                     label: 'Address type',
                                	 options: [
                                        {text: 'National',  value: 1},
                                    	{text: 'International', value: 2}                                    	
                                    ]
                            	},
                                {
                                    name: 'BusinessAddress.Address1',                                        
                                    label: 'Line 1',
                                    maxLength: 80,
                                    labelWidth: '4.5em'
                                },{
                                    name: 'BusinessAddress.Address2', 
                                    label: 'Line 2',
                                    maxLength: 80
                                },{
            						name: 'BusinessAddress.Suburb',   
            						label: 'Suburb',
                                    maxLength: 80,
                                    labelWidth: '7.5em'
            					},{
            						name: 'BusinessAddress.Town',   
            						label: 'Town/City',
                                    maxLength: 80,
                                    labelWidth: '7.5em'
            					},{
            						name: 'BusinessAddress.State',  
            						label: 'State',
                                    maxLength: 80,
                                    labelWidth: '4em'
            					},{
            						name: 'BusinessAddress.PostCode',
            						label: 'Postcode',
                                    maxLength: 30,
                                    labelWidth: '5em'
            					},{
            						name: 'BusinessAddress.Country', 
            						label: 'Country',
                                    maxLength: 30,
                                    border: '1 0 1 0',
                                    labelWidth: '5em',
                                    cls: ['rm-flatfield', 'rm-flatfield-last']
            					}]
                        }]
                    }]
            }]
    },
    
    showDetailsFields: function() {       
        this.down('#detailsFields').setHidden(false);        
    }
});