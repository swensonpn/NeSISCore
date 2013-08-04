
var app = nesis.application('sss',{
	config:{
		debug:true,
//		showBind:true,
//		showTime:true,
		defaultRoute:'sss.content.enrl'
	},
//	debug:true,
	model:{expires:'2014-07-27T21:23:25.155Z'},
	subcontrollers:{		
		menu:{},
		content:{
			subcontrollers:{
				enrl:{},
				acad:{
					components:{
						TypeAhead:{
							action:'getStuff',
							fullForm:true,
							preventSubmit:true,
							callback:function(elem){
								this.value = elem.href;
							}
						}
					}
				},
				faid:{}				
			},
			components:{
				AjaxContainer:{}				
			}
		}
	}	
});


//console.log(nesis.cache.toString());
//console.log(app.toString());
app.execute();

//console.log(app.find('id','content').toString());