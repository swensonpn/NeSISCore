nesis.mvc.datasource.dom = function(obj){
	obj.data = document.getElementById(obj.domId).innerHTML;
	return obj;
};