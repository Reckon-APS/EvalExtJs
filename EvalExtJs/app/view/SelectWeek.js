Ext.define('RM.view.SelectWeek', {
    extend: 'Ext.Panel',
    xtype: 'selectweek',
    requires: 'RM.component.RMCalendar',
    config: {
        style: 'background: #FFF',        
        items: [
			{
			    xtype: 'toolbar',
			    docked: 'top',
			    items: [
					{
					    itemId: 'back',
					    ui: 'rm_topbarbuttonleft',
					    icon: 'resources/images/icons/rm-back.svg',
					    iconCls: 'rm-backbtniconcls',
					    width: '2.6em'
					}, {
					    xtype: 'component',
					    html: 'Select a week',
					    itemId: 'title',
					    cls: 'rm-topbartitle'
					}
			    ]
			}, {
			    xtype: 'rmcalendar',
			    store: 'TimeEntriesCalendar'
			}
        ]
    }
});