Ext.define('RM.view.TimeSheetDetail', {
	extend: 'RM.component.SecurePanel',
	xtype: 'timesheetdetail',
	requires: ['RM.component.RMCheckbox','RM.component.DurationField', 'RM.component.ExtDatePickerField'],
	config: {		
	    cls: 'rm-whitebg',
		layout: 'fit',        
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
						html: '',
						itemId: 'title',
						cls: 'rm-topbartitle'
					}, {
						xtype: 'spacer'
					}, {
						text: 'Save',
						itemId: 'save',                        
						ui: 'rm_topbarbuttonright',
						hidden: true
					}
				]
			}, {
				xtype: 'secureformpanel',
				itemId: 'timeSheetForm',
				cls: 'rm-whitebg',
				padding: 0,
				items: [{
				        xtype: 'component',
				        itemId: 'status',
				        hidden: true,
				        cls: 'rm-hearderbg'
				    }, {
						xtype: 'hiddenfield',
						name: 'TimeEntryId'
					}, {
						xtype: 'hiddenfield',
						name: 'CustomerId'
					}, {
					    xtype: 'durationfield',
					    name: 'Duration',
					    itemId: 'duration',
                        hidden: true,
					    clearIcon: false,
					    cls: ['rm-flatfield', 'rm-timerfield'],
					    placeHolder: '00:00',                        
                        maxHours: 99
					}, {
					    xtype: 'extdatepickerfield',
					    name: 'Date',
					    label: 'Date',
					    dateFormat: 'jS M Y',
					    cls: 'rm-flatfield',
					    ui: 'plain',
					    placeHolder: 'select'
					}, {
						xtype: 'exttextfield',
						name: 'CustomerName',
						cls: 'rm-flatfield',
						label: 'Customer',
						clearIcon: false,
						readOnly: true,
                        placeHolder: 'select (optional)'
					}, {
						xtype: 'hiddenfield',
						name: 'ProjectId'
					}, {
						xtype: 'exttextfield',
						name: 'ProjectName',
						label: 'Project',
						cls: 'rm-flatfield',						
						readOnly: true,
                        placeHolder: 'select (optional)'
					}, {
						xtype: 'hiddenfield',
						name: 'ItemId'
					}, {
						xtype: 'exttextfield',
						name: 'ItemName',
						label: 'Item',
                        itemId: 'itemName',
						cls: 'rm-flatfield',
						placeHolder: 'select',
                        rmmandatory: true,
						readOnly: true
					}, {
                        xtype: 'rmtogglefield',
                        name: 'Billable',
                        onText: 'Yes',
                        offText: 'No',
                        toggleState: false,
						label: 'Billable',                        
                        labelWidth: '10em',                 
                    }, {
                        xtype: 'exttextfield',
                        name: 'Notes',
                        label: 'Notes',
                        itemId: 'description',
                        labelWidth: 110,
                        cls: 'rm-flatfield rm-flatfield-last',
                        hidden: true,
                        clearIcon: false,
                        placeHolder: 'enter (optional)',
                        readOnly: true,
                        enableTap: true             //enableTap config property is useful when we want to fire tap event on disabled field
                    }, {
                        xtype: 'button',
                        itemId: 'loadbtn',
                        text: 'Select criteria and tap to add/edit entry',
                        height: 47,
                        cls: ['rm-greenbtn-bg', 'rm-sharpedge-btn', 'rm-colorwhite', 'rm-fontsize80']
                    }, {
                        xtype: 'button',
                        itemId: 'resetbtn',
                        text: 'Tap to change entry criteria and reset',
                        height: 47,
                        cls: ['rm-greybtn-bg', 'rm-sharpedge-btn', 'rm-colorwhite', 'rm-fontsize80'],
                        hidden: true
                    }
                
				]
			}, {
			    xtype: 'button',
			    text: 'Delete',
			    itemId: 'deletebtn',
			    docked: 'bottom',
			    height: 47,
			    cls: ['rm-greenbtn-bg', 'rm-sharpedge-btn', 'rm-colorwhite', 'rm-fontsize80'],
                hidden: true
		    }
		]
	}
});