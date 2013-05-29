nesis.mvc = (function(){
	var o=this;

	//Timing debugger
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			console.log('document ready: fired');
		},true);
		window.addEventListener('load',function(){
			if(this.debugTiming) console.log('window load: fired');
		},true);
	}
	
	//broken ?
	o.extend = function(a,b){
		for (var k in b) {
		    if (b.hasOwnProperty(k)) {
		      a[k] = b[k];
		    }
		  }
		  return a; 
	};
	
	o.fMerge = function(a,b){
		var aValid = a instanceof Function,
			bValid = b instanceof Function;
		if(aValid && bValid){
			return function(e){
						return a(b.apply(null,arguments));					
					};
		}
		else{
			if(aValid) return a;
			if(bValid) return b;
			return function(){};
		}
	};
	
	o.gui = {};
	
	return o;	
})();
	

