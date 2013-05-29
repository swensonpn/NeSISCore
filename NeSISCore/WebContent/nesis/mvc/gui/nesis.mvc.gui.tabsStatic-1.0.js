nesis.mvc.gui.tabsStatic = function(e){
	if(!e.target instanceof View) return;
	
	var frag=e.target,parts=frag.querySelector('.mvc-tabs').children,
		tabs=parts[0].querySelectorAll('a'),l=tabs.length;
		handler=function(e){
			e.preventDefault();
			for(var i=0; i<l; i++){
				if(tabs[i] === this){
					tabs[i].className = 'active';
					parts[i+1].style.display = 'block';
				}
				else{
					tabs[i].className = '';
					parts[i+1].style.display = 'none';
				}				
			}
		};
	
	for(var i=0,l=tabs.length; i<l; i++){
		tabs[i].addEventListener('click',handler,false);
		if(tabs[i].className != 'active')
			parts[i+1].style.display = 'none';
	}
}; 