Ext.define('RM.view.History', {
    extend: 'Ext.Panel',
    xtype: 'history',
    requires: ['RM.component.RMList', 'RM.component.SecureButton'],
    config: {
        
        layout: {
            type: 'vbox',
            start: 'top',
            align: 'stretch'
        },
        items: [{
            xtype: 'toolbar',
            docked: 'top',            
            items: [{
                
                ui: 'rm_topbarbuttonleft',
                icon: 'resources/images/icons/rm-back.svg',
                iconCls: 'rm-backbtniconcls',
                width: '2.6em',                
                itemId: 'back'
            }, {
                xtype: 'component',
                itemId: 'historyTitle',
                cls: 'rm-topbartitle'
            }
                ]
        }, {
            xtype: 'securebutton',
            text: 'Add a note',
            itemId: 'addnote',
            cls: 'rm-arrowimgbtn',
            icon: 'resources/images/icons/rm-addnote.svg',
            iconCls: 'rm-btniconsize',
            iconAlign: 'left',
            permissionFor: 'Invoices'

        }, {
            xtype: 'rmlist',
            store: 'Histories',
            disableSelection: true,
            loadingText: null,            
            emptyText: 'No history entries found.',
            itemTpl: new Ext.XTemplate(
                        '<table width="100%" class="rm-tablelayout">' +
                        '<tr>' +
                            '<td width="12%"><div class={[this.showIcon(values.HistoryItemType)]}></div></td>' +
                            '<td width="88%"><div class="rm-orgnametext">{UserName}</div></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td></td>'+
                            '<td><div class="rm-historydate rm-pt5">{Date:date("d/m/Y h:i:s A")}</div></td>'+
                        '</tr>' +
                            '<td></td>' +
                            '<td><div class="rm-historytext rm-pt5">{[this.formatText(values.Text)]}</div></td>' +                       
                        '</tr>',
                        {
                            showIcon: function (value) {
                                if (value == RM.Consts.HistoryItemTypes.NOTE) return 'rm-note-icon';
                                else return '';
                            },
                            
                           formatText: function(text){
                               return text.replace(/(\r\n|\n|\r)/g,"<br/>");
                           }
                        }
                        ),            
            flex: 1            
        }
        ]
    }
});