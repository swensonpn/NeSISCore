nesis.mvc.datasource.dom = function(obj){
	var el = document.getElementById(obj.domId);
	if(!el){
		setTimeout(function(){
			nesis.mvc.datasource.dom(obj);
		},200);
	}
	else{
		obj.data = el.innerHTML;		
	}
	return obj;
};