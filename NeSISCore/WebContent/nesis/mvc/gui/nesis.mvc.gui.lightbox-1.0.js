nesis.mvc.gui.lightbox = function(e){
	var frag = e.target,content=e.arguments[1];
	if(!frag instanceof View)return;
	frag.querySelector('.mvc-lightbox-close a').addEventListener('click',function(e){
		var lb = frag.querySelector('.mvc-lightbox').parentNode;
		lb.parentNode.removeChild(lb);
	},true);
	
	if(content) frag.querySelector('.mvc-lightbox-content').innerHTML = content;
};