nesis.mvc.gui.accordianStatic = function(e){
	if(!e.target instanceof View) return; 
	
	var frag=e.target,bars=frag.querySelectorAll('.mvc-accordian-actuator a'),i=0,l=bars.length,
		handler=function(e){
			e.preventDefault();
			for(i=0; i<l; i++){
				if(this == bars[i]){
					bars[i].className = 'active';
					frag.querySelector(bars[i].getAttribute('href')).style.display = 'block';
				}
				else{
					bars[i].className = '';
					frag.querySelector(bars[i].getAttribute('href')).style.display = 'none';
				}
				
			}
		};
	
		for(; i<l; i++){
			if(bars[i].className != 'active'){
				frag.querySelector(bars[i].getAttribute('href')).style.display = 'none';
			}
			bars[i].addEventListener('click',handler,false);
		}
};