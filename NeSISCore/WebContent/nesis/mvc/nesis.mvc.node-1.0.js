nesis.mvc.Node = function(a,x){
	var ns=nesis.mvc,o=this,id,events={},children=new ns.NodeCollection(x||[]),nsStr='nesis.mvc.',
		attr=(a instanceof Object)? a : {},
		sysAttr=['id','type','path','parent'];
		
	o.append = function(node){ 
		var r = children.append(node);
		if(attr.debug && r) console.log(nsStr+'append: '+ node.attr('id'));
		return o;
	};
	
	o.attr = function(k,v){
		if(!k) return attr;
		if(!v) return attr[k]; 
		if(sysAttr.indexOf(k) == -1) attr[k] = v;
		return o;
	};
	
	o.bind = function(type,fn){	
		var rslt='fail',msg = nsStr + 'bind(';
		if(!fn || typeof fn != 'function')
			msg += type + ',Not a Function)';
		else if(!type || typeof type != 'string')
			msg += 'Not a String,' + fn + ')';  
		else{
			if(!events[type]) events[type] = [];   
			events[type].push(fn);
			msg += type + ',' + fn + ')';
			rslt='success';
		}
        if(ns.debugEventBind || attr.debug) console.log(rslt + ': ' + msg);
	};
	
	o.children = function(k,v){
		if(k && v) return children.find(k,v);
		return children;
	};
	
	o.find = function(k,v){
		return children.find(k,v,true);
	};
	
	o.parent = function(){
		return attr.parent;
	};
	
	o.remove = function(node){
		var r = children.remove(node);
		if(attr.debug && r instanceof ns.Node) console.log (nsStr + 'remove:' + r.attr('id'));
		return o;
	};
	
	o.toString = function(){
		var str = 'Node:{\n';
    	for(var k in attr){
    		if(k == 'parent')str += '\t' + k + ': object Node(' + attr[k].attr('id') + ')\n';
    		else str += '\t' + k + ': ' + attr[k] + '\n';    		
    	}
    	str += '\tchildren:\n' + children.toString(2);
    	return str + '}';
	};
	
	o.trigger = function(e){
		var evt,eMsg = nsStr + 'trigger(';
		
		if(typeof e == 'string')
			evt = new ns.Event(e);
		else if(e instanceof ns.Event)
			evt = e;
		else 
			return;
			
		evt.target = e.target || o;	
		
 //   	if(!events[evt.type]){
 //   		if(ns.debugTiming) console.log(eMsg + evt.type + '): None Defined');
 //   	}
 //   	else{
if(events[evt.type]){		
    		var i=0,l=events[evt.type].length;  
    		for(; i < l; i++){ 	    					
				events[evt.type][i].call(o,evt);
				//events[evt.type][i](evt);
				if(ns.debugEventFired || attr.debug) console.log(eMsg + evt.type + '): ' + events[evt.type][i]);
				if(ns.debugTiming) console.log(eMsg + evt.type + '): fired');	    			
    		}
}    		
//    	} 
    	
    	if(evt.bubbles && attr.parent) {
    		if(attr.parent.trigger) attr.parent.trigger(evt);
    	}
	};
	
	o.unbind = function(type,fn){
		var i=0,l,rslt='fail';
        if(o.events[type]) {  
            for(l=o.events[type].length; i < l; i++){
                if(o.events[type][i] == f){
                    o.events[type].splice(i, 1);
                    if(ns.debugEventUnbind || attr.debug) console.log(nsStr + 'unbind(' + type + ',' + fn +  ')');
                }
            }
        }       
	};
	
	//Start Constructor
	a = (a && typeof a == 'object') ? a : {};	
	for(var k in a){
//		if(o[k] && typeof o[k] == 'function') console.log('Eureka: ' + o[k]);//what was this for?
		attr[k] = a[k];
	}		
	id = attr['id'];
	nsStr += id+'.';
	if(typeof attr.onchange == 'function') o.bind('change', attr.onchange);
	if(typeof attr.oncreate == 'function') o.bind('create', attr.oncreate);
	o.trigger('create');	
};