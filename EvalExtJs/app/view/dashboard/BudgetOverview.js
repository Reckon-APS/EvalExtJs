Ext.define('RM.view.dashboard.BudgetOverview', {
    extend: 'Ext.Panel',
    xtype: 'dbbudgetoverview',	
    config: {
        
    },
	
    initialize: function() {        
		this.callParent(arguments);
		this.add([{
				//html: '<span><u>BUDGET OVERVIEW</u></span>'
                html: '<h2 class="rm-hearderbg">BUDGET OVERVIEW</h2>'
			},{
				xtype: 'container',
				layout: 'vbox'
		}]);
	},
	
	setViewData: function(data){
        //Added try catch as were getting some unexpected values in data such as -ve actual amounts and it was causing whole app to not run
        try{
            this.getComponent(1).removeAll(); 
            
            /*if (!RM.PermissionsMgr.canView('Budgets')) {
                this.getComponent(1).add({
                    xtype: 'component',
                    html: '<div class="rm-dashboard-nodata">' + RM.Consts.NoAccessMsg + '</div>'
                });            
                return;
            }*/
            
            if(data==null || data.length<=0 ){  
                this.getComponent(1).add({
                    xtype: 'component',
                    html: '<div class="rm-dashboard-nodata">No data found</div>'
                });            
                return;
            }
                   
    		for(var i = 0; i< data.length; i++){
                
    			this.addBudget(data[i],i);
    		}
            this.paintChart(data);
        }
        catch(err){
            console.log('**** Exception in BudgetOverview setViewData ' + err.message);
        }
	},
	
	addBudget: function(budgetData,xindex){
        
		this.getComponent(1).add({
			xtype: 'component',
			//html: budgetData.Name + '<br/>Actual $' + budgetData.Actual + '<br/>Forecast $' + budgetData.Forecast,
            html: 
            '<div >'+  
            '<div class="rm-budgetoverview rm-budgetoverviewarrow">'+
            '<span class="rm-budgetoverviewname">'+budgetData.Name+'</span>'+
            '<span class="rm-budgetoverviewprice"> - ' + RM.AppMgr.formatCurrency(budgetData.Actual, 0) + '</span>'+
            '<div class="rm-clr"></div>'+
            '<canvas id="lineBarChart'+xindex+'" style="width: 92%;background: #ccc;height: 10px; margin-left: 5px;"></canvas>'+
            '<div class="rm-clr"></div>'+
            '<div class="rm-alignr rm-remainingforcast" id="remainingForcast'+xindex+'"></div>'+
            '<div class="rm-clr"></div>'+            
            '</div>'+
            '</div>'+
            '<div class="rm-p5"></div>'+
            '</div>',
			/*listeners:{
				painted: function(ele){
					ele.on('tap', function(){
						this.onBudgetTap(budgetData);
					}, this);
				},
				scope: this					
			}*/
			listeners: {tap: {element: 'element', fn: function(c){
				this.onBudgetTap(budgetData);
			
			}, scope: this}
			}
		
		});	
	},
	
	onBudgetTap: function(data){		
		var budgetLineItemsC = RM.AppMgr.getAppControllerInstance('RM.controller.BudgetLineItemsC');
		budgetLineItemsC.showView(data.BudgetId, data.Name);		
	},
	
	paintChart: function(recordData){                       
                                                
                        
        count = recordData.length;                         
        var budgetOverview = recordData;                   
        
        for(i=0;  i < count; i++) {
            var actual = budgetOverview[i].Actual;
            var forecast = budgetOverview[i].Forecast;
            var barNumber = i;
            if(forecast == 0) continue;
            var percentage = actual/forecast;
            var remainingForcastHtml = '';
            var c = document.getElementById('lineBarChart' + barNumber);
            ctx = c.getContext("2d");
            if(percentage <= 1) {                                
                var lingrad=ctx.createLinearGradient(0,0,c.width,0);
                lingrad.addColorStop(0, '#A1D079');
                lingrad.addColorStop(percentage, '#A1D079');
                lingrad.addColorStop(percentage, '#eeeeee');
                lingrad.addColorStop(1, '#eeeeee');
    
                ctx.fillStyle=lingrad;
                ctx.fillRect(0,0,c.width,300);
                remainingForcastHtml = ((1 - percentage) * 100).toFixed(2);
                remainingForcastHtml = remainingForcastHtml+ '% remaining';
            }
            else {
                c.style.border = "2px solid #016f67"
                ctx.rect(0, 0, c.width, 300);
                ctx.fillStyle="#009f94";
                ctx.fill();
                remainingForcastHtml = ((percentage - 1) * 100).toFixed(2);
                remainingForcastHtml = remainingForcastHtml+ '% <span class="rm-reddotright rm-pl0">over</span>';
            }
            
            var remainingForcast = document.getElementById('remainingForcast' + barNumber);
            remainingForcast.innerHTML = remainingForcastHtml;
        }
    }
});