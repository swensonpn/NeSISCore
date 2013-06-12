var app = new nesis.mvc.Application({	
	model:{
		contentType:'text/html',
		data:'<div id="app/tabs"></div>',
	}	
});

app.controller('tabs',{
		model:{
			contentType:'text/html',
			data:'<div class="mvc-tabs"><ul class="mvc-tab-list"></ul><div class="mvc-tab-content"></div></div>'
		},
		view:{
			onbeforerender:function(e){
				nesis.mvc.gui.tabsAjax(e);	
			}
		},
		defaultNode:true
	})		
	.controller('static',{
		model:{
			contentType:'text/html',
			expires:'Wed, 23 May 2013 18:47:53 GMT',
			url:'http://localhost/NeSISCore/demos/guiControls/static.php'
		},
		view:{
			onbeforerender:function(e){
				nesis.mvc.gui.tabsStatic(e);
				nesis.mvc.gui.accordianStatic(e);
			}
		},
		label:'Static Controls'
	})
	.parent()
	.controller('edittable',{
		model:{
			contentType:'text/html',
			expires:'0',
			url:'http://localhost/NeSISCore/demos/guiControls/textEditableAjax.php'
		},
		view:{
			onbeforerender:function(e){
				nesis.mvc.gui.textEditableAjax(e);
			}
		},
		label:'Ajax Editable Content'
	})
	.parent()
	.controller('ajaxForm',{
		model:{
			contentType:'text/html',		
			lastModified:'Wed, 22 May 2013 17:44:03 GMT',
			url:'http://localhost/NeSISCore/demos/guiControls/formAjax.php'
		},
		view:{
			onbeforerender:function(e){
				nesis.mvc.gui.formAjax(e);
			}
		},
		label:'Ajax Form'
	})
	.parent()
	.controller('pslinks',{		
		label:'Modal Windows',
		model:{
			contentType:'text/html',
			lastModified:'Wed, 22 May 2013 17:44:03 GMT',
			url:'http://localhost/NeSISCore/demos/guiControls/psLinkList.php',
			template:''
		},
		view:{
			onbeforerender:function(e){				
				var links = e.target.querySelectorAll('.mvc-pslink-list a'),l=links.length;
				for(; l>0; l--){
					var i = l-1; 
					links[i].addEventListener('click',function(e){ 
						e.preventDefault();
						var html = '<iframe id="mvc-target-frame" name="mvc-target-frame" src="' + links[i].getAttribute('href') + '"></iframe>';
						app.controller('lightbox').execute({data:html});
							
					},true);
				}
			}
		}
	})
	.parent()
	.controller('templates',{
		model:{
			contentType:'text/json',		
			lastModified:'Wed, 22 May 2013 17:44:03 GMT',
			url:'http://localhost/NeSISCore/demos/guiControls/json.php'
		},
		view:{
			templates:{
				'list':{
					domId:'test',
					templateType:'javascript'
				},
				'table':{
					url:'http://localhost/NeSISCore/demos/guiControls/js/listTemplate.js',
					//domId:'test2',
					templateType:'javascript',
					defaultNode:true
				} 
			}
		},
		label:'JSON Templating',
		defaultNode:true,
		//debug:true
	});
	
app.controller('lightbox',{	
		model:{			
			contentType:'text/html',
			data:'<div class="mvc-lightbox"><div class="mvc-lightbox-shadow"></div><div class="mvc-lightbox-window"><span  class="mvc-lightbox-close"><a title="close"></a></span><div class="mvc-lightbox-content"></div></div>'
		},
		view:{
			onbeforerender:function(e){
				nesis.mvc.gui.lightbox(e);
			}
		}
	});


app.execute();