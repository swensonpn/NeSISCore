nesis.mvc.gui.tabsAjax = function(e){	

	if(!e.target instanceof View)return;
	
	var frag=e.target,tabBar=frag.querySelector('.mvc-tab-list'),tabs=[],a,li,content=frag.querySelector('.mvc-tab-content'),
		handler=function(e){
			var href = e.target.getAttribute('href'),i=0,l=tabs.length;
			for(var i=0; i<l; i++){						
				tabs[i].className = (tabs[i].getAttribute('href') == href) ? 'active' : '';							
			}		
			content.id = href.slice(1,-1);
		};

	frag.parent().children().each(function(){
		var o=this,a=document.createElement('a'),id=this.attr('id');
		if(o.attr('type') == 'Controller'){
			this.bind('beforerender',function(e){
				if(e.target != o.view()) return;				
				var href = o.attr('path'),i=0,l=tabs.length;
				content.id = href;
				for(var i=0; i<l; i++){						
					tabs[i].className = (tabs[i].getAttribute('href').slice(1,-1) == href) ? 'active' : '';							
				}	
			});
		
			a.href = '#' + this.attr('path') + '/';			
			a.title = this.attr('description') || id;
			a.innerHTML = this.attr('label') || id;
			a.addEventListener('click',handler,true);
			if(this.attr('defaultNode'))a.className = 'active';
			tabs.push(a);
			li = document.createElement('li');
			li.appendChild(a);
			tabBar.appendChild(li);
		}		
	});
};
