Ext.define('RM.view.MainNavContainer', {
    extend: 'RM.component.slidenavigation.View',

    requires: [
        'Ext.Container',
        'Ext.MessageBox',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.event.publisher.Dom',
		//'RM.view.bankaccounts.BankAccounts',
		'RM.view.dashboard.Dashboard',
		'RM.view.Invoices',
		'RM.view.bills.Bills',
		'RM.view.budgets.Budgets',
		'RM.view.TimeSheets',
		'RM.view.Expenses',
        'RM.view.Contacts',
		//'RM.view.settings.MyPreferences',
        'RM.view.About',
        'RM.view.PayAmountInputNav',
        'RM.view.PaySalesHistory',
        'RM.view.Modules'
		//'RM.view.settings.LinkBankAccount'
		//,'RM.view.settings.CompanySettings'
    ],

    config: {
        fullscreen: true,
        closeOnSelect: true,
        slideSelector: 'x-toolbar',
        //slideSelector: 'x-body',        
        selectSlideDuration: 200,
        
        list: {
            maxDrag: 275,
            width: 275,            //Raj: Please change width in rm-slidenav-menuitem-msg of app.scss whenever this width is changed
            items: [{
                xtype: 'toolbar',
                docked: 'top',
				//ui: 'rm-slidenav-topbar'
                
            }],            
			itemTpl: new Ext.XTemplate(	
							
                            '{[this.switchBgColor(values.title, values.activated)]}',
							{
								switchBgColor: function(titleText, activated){									
									if(titleText == 'Reckon home' || titleText == 'Lock' || titleText == 'Logout') {
                                        return '<div class="rm-slidenav-menuitem">'+titleText+'</div>';
                                    }                       
									
                                    else if(!activated){                                        
                                        return '<div class="rm-slidenav-menuitem-msg"><div class="leftlabel">'+titleText+'</div><div class="rightlabel"> not activated</div></div>'
                                    }
                                    else
                                    {
                                        return '<div>' + titleText + '</div>';
                                    }
                                    
								}
							}
                            ),
                            
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {  
                    //Stop event from propagating so we can select lock again when app is unlocked
                    if(record.raw.index && record.raw.index === 'Lock'){ 
                        this.closeContainer();
                        RM.AppMgr.lock();                        
                        return false;
                    }
                    //cause slide nav to close when already selected item is closed again
                    if(list.isSelected(record))
                        RM.ViewMgr.closeMainNav();
                },
				painted: function(){
				}
            }

        },

        groups: {},
        onegroups: {'GENERAL':1,'RECKON ONE': 2,'SETTINGS': 3},
        paygroups: {'GENERAL':1,'RECKON PAY': 2,'SETTINGS': 3},
        
        items: [],
        oneitems: [
        {
            index: 'Lock',
            title: 'Lock',
            activated: true,  
            handler: function(){
                //To avoid white screen on app startup as 0 is set as default selected item in parent class
                //Handler for lock is itemtap event, check listeners itemtap above
                RM.AppMgr.lock();
            },
			group: 'GENERAL'
        },
        {           
            title: 'Logout',
            activated: true,
            handler: function () {
                RM.AppMgr.logout();
            },
			group: 'GENERAL'
        },
        /*{
            title: 'Reckon home',
            activated: true,
            handler: function () {
                if(RM.AppMgr.isLoggedIn()){ //otherwise the select module screen flashes up at the start before login or enter pin
                    RM.AppMgr.selectModule();
                }   
            },
			group: 'GENERAL'
        },*/
        {
            index: 'Cashbooks',
            title: 'Choose book',
            activated: true,            
            group: 'RECKON ONE',
            handler: function () {
                RM.CashbookMgr.selectCashBook();
            }
        },{
            index: 'Dashboard',
            xtype: 'dashboard',
            title: 'Dashboard',
            activated: true,
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'  //to insert at left of toolbar, have changed source code of slidenavigation\View.js  line 206 changed return parent.add(Ext.merge(me.slideButtonDefaults, config)); to return parent.insert(0, Ext.merge(me.slideButtonDefaults, config));
            }
        },/* {
            xtype: 'bankaccounts',
            title: 'Bank accounts',
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            }
        },*/ {
            xtype: 'invoices',
            index: 'Invoices',
            title: 'Invoices',
            activated: true,            
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            },
            data : { permsRequired : true }
        },/* {
            xtype: 'bills',
            index: 'bills',
            title: 'Bills',
            activated: true,
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            }
        },*//* {
            xtype: 'budgets',
            index: 'budgets',
            title: 'Budgets',
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            }
        },*/ {
            xtype: 'timesheets',
            index: 'Timesheets',
            activated: true,            
            title: 'Timesheets',
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            },
            data : { permsRequired : true }
        }, {
            xtype: 'expenses',
            index: 'ExpenseClaims',
            title: 'Expenses',
            activated: true,
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            },
            data : { permsRequired : true }
        }, {
            xtype: 'contacts',
            index: 'Contacts',
            title: 'Contacts',
            activated: true,
            group: 'RECKON ONE',
            slideButton: {
                selector: 'toolbar'
            },
            data : { permsRequired : true }
        },/* {
            xtype: 'mypreferences',
            title: 'Preferences',
            activated: true,
            group: 'SETTINGS',
            handler: function () {
                RM.ViewMgr.showMyPreferences();  
            }   
        },*/ {
            xtype: 'about',
            title: 'About',
            activated: true,
            group: 'SETTINGS',
            slideButton: {
                selector: 'toolbar'
            }
        }/*, {
            xtype: 'linkbankaccount',
            title: 'Link bank account',
            group: 'SETTINGS',
            slideButton: {
                selector: 'toolbar'
            }
        }, {
            xtype: 'companysettings',
            title: 'Company settings',
            group: 'SETTINGS',
            slideButton: {
                selector: 'toolbar'
            }
        }*/],
        itemsPay: [
        {
            title: 'Lock',
            activated: true,
            handler: function () {
                RM.AppMgr.lock();
            },
			group: 'GENERAL'
        },{           
            title: 'Logout',
            activated: true,
            handler: function () {
                RM.AppMgr.logout();
            },
			group: 'GENERAL'
        },
        {
            title: 'Reckon home',
            activated: true,
			group: 'GENERAL',
            handler: function () {
                if(RM.AppMgr.isLoggedIn()){ //otherwise the select module screen flashes up at the start before login or enter pin
                    RM.ViewMgr.mainNavContainer.reloadItems("reckonone");
                    RM.AppMgr.selectModule();
                }   
            }
        },
        {
            index: 'PayAmountInput',
            xtype: 'payamountinputnav',
            title: 'Receive payment',
            activated: true,            
            group: 'RECKON PAY',
            slideButton: {
                selector: 'toolbar'  //to insert at left of toolbar, have changed source code of slidenavigation\View.js  line 206 changed return parent.add(Ext.merge(me.slideButtonDefaults, config)); to return parent.insert(0, Ext.merge(me.slideButtonDefaults, config));
            }
        },{
            index: 'PaySalesHistory',
            xtype: 'paysaleshistory',
            title: 'Transaction history',
            activated: true,
            group: 'RECKON PAY',
            slideButton: {
                selector: 'toolbar'  //to insert at left of toolbar, have changed source code of slidenavigation\View.js  line 206 changed return parent.add(Ext.merge(me.slideButtonDefaults, config)); to return parent.insert(0, Ext.merge(me.slideButtonDefaults, config));
            }
        },{
            xtype: 'paypreferences',
            title: 'Preferences',
            activated: true,
            group: 'SETTINGS',
            slideButton: {
                selector: 'toolbar'
            }
        },
        {
            xtype: 'about',
            title: 'About',
            activated: true,
            group: 'SETTINGS',
            slideButton: {
                selector: 'toolbar'
            }
        }]
        /*,

        listeners: {
            painted: function () {
                //this.openContainer(0);
            },
            open: function () {
                //alert('select');

            }
        }*/
    },
    
    onSelect: function(list, item, eOpts) {       
        this.callParent(arguments);
        this.fireEvent('itemselected', item.raw);
    },
    
    setSelectedItem: function (key) {
      var keyIndex = this.store.getData().indexOfKey(key);
        
      //alert(key);
      //alert(keyIndex);
      if(keyIndex > 0)  {
          this.list.select(keyIndex);
      }
    },
    
    isItemSelected: function (key) {
      var keyIndex = this.store.getData().indexOfKey(key);
      if(keyIndex > 0)  {
          return this.list.isSelected(keyIndex);
      }  
      return false;
    },
    
    initialize: function() {
       this.callParent();        
       RM.AppMgr.application.on( {'rm-permissionsupdated' : this.applyPermissions, scope : this} );
    },
    
    applyPermissions: function() {
        this.store.clearFilter();
        this.store.filterBy(function(item) { 
               var data = item.get("data");
               if(data && data.permsRequired) {
                 var itemIndex = item.get("index");
                 return RM.PermissionsMgr.canView(itemIndex);
               }
               else { return true; }
            }
        );
    }
});