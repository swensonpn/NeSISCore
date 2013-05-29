nesis.core.store = {
	supported:false,
	_init:function(options){
		this.supported = (typeof(Storage) && JSON)? true : false;
		
		this.debug = options.debug || false;
		if(options.flush) this.flush();
		
		if(this.debug) console.log("nesis.core.store.supported: " + this.supported);
	},
	clear:function(key){
		if(localStorage[key]) localStorage[key] = null;
		else if(sessionStorage[key]) sessionStorage[key] = null;
		if(this.debug) console.log("nesis.core.store.clear: " + key + " has been cleared");
	},
	flush:function(){
		localStorage.clear();
		sessionStorage.clear();
	},
	get:function(key){
		var value,store;		
		if(sessionStorage[key]){ 
			value = eval(sessionStorage[key]);
			store = 'sessionStorage';
		}
		else if(localStorage[key]){
			value = eval(localStorage[key]);
			store = 'localStorage';
		}
		if(this.debug) console.log("nesis.mvc.model.get: \n\t" + store + "." + key + "=" + value);
		return value;
	},
	set:function(key,value,persist){
		var store = (persist === true)? localStorage : sessionStorage;
		store[key] = JSON.stringify(value);
		if(this.debug) console.log("nesis.core.store.set: persistent=" + persist + ", " + key + "=\n\t" + value);
	}
};