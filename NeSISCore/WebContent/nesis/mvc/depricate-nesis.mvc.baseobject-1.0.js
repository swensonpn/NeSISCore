//Depends on Collection
nesis.mvc.BaseObject = function(a,x){
	var ns=nesis,o=this,events;
	
	o.childNodes;
	o.parentNode = null;
	
	o.addEventListener = function(type, f, bubble){	
        if(!events[type]) events[type] = [];   
        events[type].push(f);
/*        
        events[type].push({
            handler: f,
            type: type,
            target: o
        });
*/     
        if(ns.mvc.debugEventBind) console.log(o.id + '.addEventListener(' + type + ',' + f + ',' + bubble + ')');
    };
    
    o.appendChild = function(k,v){	
    	return o.childNodes.set(k,v);
    };
    

    o.dispatchEvent = function(e){
    	var evt = (typeof e == 'object')? e : {},
    		type = (typeof e == 'string')? e : e.type;
    	
    	if(!events[type]){
    		if(ns.mvc.debugTiming) console.log(o.id + '.' + type + ': None Defined');
    	}
    	else{
    		var i=0,l=events[type].length;
    		for(; i < l; i++){ 
    			try{
    				if(typeof events[type][i] != 'function') throw Error('nesis.mvc.'+o.id+'.dispatchEvent: Handler is not a function');
    				evt.target = o;
    				events[type][i](evt);
    				if(ns.mvc.debugEventFired) console.log(o.id + '.' + type + ': ' + events[type][i]);
    				if(ns.mvc.debugTiming) console.log(o.id + '.' + type + ': fired');
    			}
    			catch(err){nesis.core.error.handle(err);}
    		}
    	}    	
    };
    
    /*
    o.dispatchEvent = function(type){
    	if(!events[type]){
    		if(ns.mvc.debugTiming) console.log(o.id + '.' + type + ': None Defined');
    	}
    	else{
    		var i=0,l=events[type].length;
    		for(; i < l; i++){ 
    			try{
    				if(typeof events[type][i].handler != 'function') throw Error(ns+'.mvc.'+o.id+'.dispatchEvent: Handler is not a function');
    				events[type][i].handler(events[type][i]);
    				if(ns.mvc.debugEventFired) console.log(o.id + '.' + type + ': ' + events[type][i].handler);
    				if(ns.mvc.debugTiming) console.log(o.id + '.' + type + ': fired');
    			}
    			catch(err){nesis.core.error.handle(err);}
    		}
    	}
    };
    */
    
    o.getAttribute = function(v){
    	return o[k];
    };
    
    o.getElementById = function(id){
    	return o.childNodes.get(id);
    };
    	
    o.removeChild = function(k){
    	return o.childNodes.set(k,null);
    };
    
    o.removeEventListener = function(type, f){
    	var i=0,l=o.events[type].length;
        if(o.events[type]) {    	
            for(; i < l; i++){
                if(o.events[type][i].handler == f)
                    o.events[type].splice(i, 1);
            }
        }
        if(ns.mvc.debugEventUnbind) console.log(o.id + '.removeEventListener(' + type + ',' + f +  ')');
    };
    
    o.setAttribute = function(k,v){
    	o[k] = v;
    	return o;
    };
    
    o.toString = function(){
    	var n,str = typeof o + '{\n';
    	for(n in o){											
    		str += n + ': ';
    		if(o[n] instanceof ns.mvc.Collection) str += o[n].toString();
    		else str += o[n]; 
    		if(!o[n]);
    		str += '\n';
    	}
    	return str + '}';
    };
    
	(function(a,x){  
		if(a) for(var i in a){o[i] = a[i];};        
		

		x = (x instanceof Object)? x : {};
		events = {};  	
    	o.childNodes = new ns.mvc.Collection(x); 	  
    		
    	if(typeof o.onchange == 'function') o.addEventListener("change",o.onchange);
    	if(typeof o.oncreate == 'function') o.addEventListener("create",o.oncreate);
    	o.dispatchEvent("create");
	})(a,x);
	
};