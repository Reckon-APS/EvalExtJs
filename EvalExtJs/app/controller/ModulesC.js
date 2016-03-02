Ext.define('RM.controller.ModulesC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.Modules'],
    config: {
        refs: {
            modules: 'modules',
            optionsBtn: 'modules #options',
            modulesList: 'modules dataview'
        },
        control: {
            'modules': {
                show: 'onShow',
                hide: 'onHide'
            },
            'modules dataview': {
                itemtap: 'onItemTap'
            },
            'modules #options': {
                tap: 'onOptions'
            }
        }

    },
    
    showView: function (cb, cbs) {
        this.selectCb = cb;
        this.selectCbs = cbs;

        var view = this.getModules();
        if (!view){
            view = { xtype: 'modules' };
        }
        
        RM.ViewMgr.clearBackStack();
        RM.ViewMgr.showPanel(view);

    },    
    
    onShow: function(){
        Ext.Viewport.on('resize', 'hideInfoSheet', this);
        this.getModulesList().getStore().setData(RM.AppMgr.getModuleData());
    },
    
    onHide: function(){
        this.hideInfoSheet();        
    },
    
    onOptions: function () {

        var menu = Ext.create('RM.component.DropdownOverlay');
        var menuItems = new Array();
        var options = [{
            text: 'Lock',
            value: 'lock'
        },{
            text: 'Logout',
            value: 'logout'
        }, {
            text: 'Change PIN',
            value: 'changepin'
        }];
        if (options.length) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                var btn = {
                    xtype: 'button',
                    itemId: option.value,
                    text: option.text,
                    //cls: 'rm-dropdownmain',
                    ui: 'rm_btnaslistrowmainmenu'
                };
                menuItems.push(btn);
            }
        }

        menu.show(this.getOptionsBtn(), this.onDropdownMenuItemSelect, this, menuItems, 'tr-br');

    },

    onDropdownMenuItemSelect: function (optionId) {
        
        if (optionId == 'logout') {
            localStorage.removeItem('RmHasMobilePin');
            RM.AppMgr.loginUserName();
        }
        else if(optionId == 'lock'){
            RM.AppMgr.lock();
        }
        else if(optionId == 'changepin'){
            
            RM.AppMgr.showOkCancelMsgBox('You will be logged out of this application if you choose to continue. On entering you will be prompted to create a new PIN.',
                function(btn){
                   if(btn == 'ok'){
                        localStorage.removeItem('RmHasMobilePin');
                        RM.AppMgr.loginUserName();
                   }
                },this
            );            
            
        }
    },    

    onItemTap: function (dataView, index, target, rec, e, eOpts) {
		
        var data = rec.data;
            
        /*if(!data.Activated){
			//(target left + target midpoint - arrow midpoint) whenever there is a change in arrow image, change midpoint value
            this.showInfoSheet(data, (e.target.offsetLeft + e.target.clientWidth / 2) - 22);   
        }
        else {*/
            this.hideInfoSheet();          
            this.selectCb.call(this.selectCbs, data);
        //}
     
    },
    
    hideInfoSheet: function(){
        if(this.infoSheet){
            Ext.Viewport.un('resize', 'hideInfoSheet', this);
            this.infoSheet.destroy();            
        }
    },
    
    showInfoSheet: function(data, arrowLeft){
        
        this.hideInfoSheet();                       
        var panelHeight = Ext.Viewport.getWindowHeight()-270;
        this.infoSheet = Ext.create('Ext.ActionSheet', {
            height: panelHeight,            
            modal: false,
            showAnimation: null,
            hideAnimation: null,
            cls: 'rm-module-panel',
            items: [
                {
                    xtype: 'component',                    
					cls: 'rm-module-panel-arrow',  
					left: arrowLeft,
                    zIndex: 1000                    
                },           
                {
                    xtype: 'component',
                    html: 'You have not activated ' + data.FullName,
                    cls:'rm-module-title'                    
                },{
                    xtype: 'component',
                    html: data.Description,
                    cls:'rm-module-msg'                                        
                },{
                    xtype: 'container',
                    layout: 'hbox',
                    docked: 'bottom',
                    padding: 15,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Activate ' + RM.AppMgr.capitalizeString(data.ShortName),
                            height: 48,
                            cls:'rm-activate-btn',
                            handler: function(){                                
                                alert('activate ' + data.ModuleCode);                                
                            },
                            scope: this
                        },{
                              xtype: 'component',
                               flex: 1,
                            
                            
                        },{
                            xtype: 'button',
                            cls: 'rm-module-close-btn',                            
                            handler: function(){                        
                                this.infoSheet.hide();                        
                            },
                            scope: this
                        }
                    
                    ]
                }
 
            ]
        });
        
        Ext.Viewport.add( this.infoSheet);
        this.infoSheet.show(); 
        
    }

});
