nesis.mvc.Event = function(eventType){
	if(eventType !== 'MVC') return document.createEvent(eventType);
	
	this.initEvent = function(){
		var a=arguments;
		this.type = a[0];
		this.bubbles = a[1] || true;
		this.cancelable = a[2] || true;	
		this.arguments = new Array();
		if(a[3])
			for(var i=0, l=a[3].length; i<l; i++){
				this.arguments.push(a[3][i]);
			}
	};	
};