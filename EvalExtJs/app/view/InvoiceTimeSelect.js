Ext.define('RM.view.InvoiceTimeSelect', {
   extend: 'RM.component.SecurePanel',
	xtype: 'invoicetimeselect',
    requires: 'RM.component.RMList',
    config: {
		permissionFor: 'Invoices',
		layout: 'fit',
		items:[{
                xtype: 'toolbar',                
                docked: 'top',
                items: [{
						ui: 'rm_topbarbuttonleft',
						icon: 'resources/images/icons/rm-back.svg',
                        iconCls: 'rm-backbtniconcls',
                        width: '2.6em',						
						itemId: 'back'				
					},{
						xtype: 'component',
						html: 'Add time',
						cls: 'rm-topbartitle',
					},{
						xtype: 'spacer'
					},{
						text: 'Add',
						itemId: 'add',                        
						ui: 'rm_topbarbuttonright'				
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top',
				sortfields: [
							{text: 'Customer',  value: 'CustomerName'},
							{text: 'Project', value: 'ProjectName'},
							{text: 'Date',  value: 'Date'},
							{text: 'Employee',  value: 'EmployeeName'}
				]
			},{
				xtype: 'rmlist',
				store: 'InvoiceTimeSelect',
                loadingText: null,
                emptyText: 'No time entries found.',
				disableSelection: true,
				grouped: true,
                itemTpl: new Ext.XTemplate(
                        //Row1                   
                        '<div>',  
                            '<div style="width: 10%; display: inline-block;">',
                                   '<div style="margin: auto;" class="rm-checkbox rm-checkbox',
    				                    '<tpl if="Selected == true">',
    				                        '-on',                                            
    				                    '</tpl>',
                                        '<tpl if="Selected == false">',
    				                        '-off',                                            
    				                    '</tpl>'+'">',
                                  '</div>',
                            '</div>',
                            '<div style="width: 55%; display: inline-block; vertical-align: top;">',
                                '<div class="rm-orgnametext">{EmployeeName}</div>',
                            '</div>',
                            '<div style="width: 35%; display: inline-block; vertical-align: top;">',
                                '<div class="rm-floatr rm-orgnametext rm-alignr">{[RM.AppMgr.hoursToTime(values.Duration)]}</div>',
                             '</div>',
                        '</div>',
                        //Row 2    
                        '<div>',
                            '<div style="width: 10%; display: inline-block;">',                            
                            '</div>',
                            '<div style="width: 40%; display: inline-block; vertical-align: top;">',                              
                                '<div class="rm-invoicetimeselect-date rm-pt5">{Date:date("jS M Y")}</div>',
                            '</div>',
                            '<div style="width: 50%; display: inline-block; vertical-align: top;">',
                                '<div class="rm-floatr rm-invoicetimeselect-project rm-alignr rm-pt5">{ProjectName}</div>',
                            '</div>',
                        '</div>',
                        //Row 3    
                        '<div>',
                            '<div style="width: 10%; display: inline-block;">',                         
                            '</div>',
                            '<div style="width: 65%; display: inline-block; vertical-align: top;">',
                                '<div class="rm-invoicetimeselect-desc rm-pt5">{ItemName}</div>',
                            '</div>',
                            '<div style="width: 25%; display: inline-block; vertical-align: top;">',
                                '<div class="rm-floatr rm-notelink rm-alignr rm-pt5">History</div>',
                            '</div>',
                        '</div>',                        
                        {
                            getDurationFormat: function(duration){
                                var totalMin = duration*60;
                                var hr = parseInt(totalMin/60);
                                var min = parseInt(totalMin%60);
                                var output = "";

                                if(hr==1) output = hr+" hr ";
                                else if(hr>1) output = hr+" hrs ";
                                if(min==1) output+= min+" min";
                                else if(min>1) output+= min+" mins";

                                return output;
                            }
                        })
			}
        ] 
    },
	
    initialize: function() {
		
		this.callParent(arguments);		
		this.on('tap', 
			function(e){
                var header = e.getTarget('div.x-list-header', 10, true);
				if(header){
					var baseCls = 'rm-checkbox', checkBox = header.down('.' + baseCls);
                    checkBox.toggleCls(baseCls + '-on');
                    checkBox.toggleCls(baseCls + '-off');

					this.fireEvent('headertap', checkBox.next().getHtml(), checkBox.hasCls('rm-checkbox-on'));
				}
			}, 
			this, {element:'element'}
		);

	}	
});