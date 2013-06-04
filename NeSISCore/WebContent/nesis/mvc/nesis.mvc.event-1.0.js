nesis.mvc.Event = function(eventType,data){
	if(!eventType || typeof eventType != 'string') return false;
	data = data || {};
	
	this.type = eventType;
	this.bubbles = data.bubbles || true;
	this.cancelable = data.cancelable || true;	
	this.arguments = data.arguments;
};