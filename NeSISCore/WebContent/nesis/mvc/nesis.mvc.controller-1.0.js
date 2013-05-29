//Depends on BaseObject
nesis.mvc.Controller = function(a,x){
	var ns=nesis.mvc,o=this,bExeEvent = new ns.Event('MVC'), aExeEvent = new ns.Event('MVC'),
		register = function(c){
			var p=c.parentNode,safety=15,path="";
			do{
				path = c.id + '/' + path;				
				if(c.router){
					c.router(path.replace(/\/$/,''),o); 
					break;
				}
				else{
					c=p; 
					p=p.parentNode;
				} 
				safety--;
			}while(p != null || safety>0);
			return path.slice(0,-1);
		},
		setSubController = function(k,v){							
			if(v instanceof ns.Controller === false){
				var n,attr={},nodes={};		
				for(n in v){
					if(v.hasOwnProperty(n)){ 
						if(n == 'model') nodes[n] = v[n];
						else if(n == 'view') nodes[n] = v[n];
						else attr[n] = v[n];
					}
				}    							
				attr.id = k;
				attr['parentNode'] = o;
				v = new ns.Controller(attr,nodes);
			} 
			return o.appendChild(k,v);
		},
		toString = function(){
			var i=0,l,str = "Controller (" + o.id + "):{\n",
				authItems = ['id','type','oncreate','onchange','onbeforeexecute','onafterexecute','childNodes'];
			for(l=authItems.length; i<l; i++){
				if(o[authItems[i]] instanceof ns.Collection){
					str += '\t' + authItems[i] + ': ' + o[authItems[i]].toString(1);
				}
				else str += '\t' + authItems[i] + ': ' + o[authItems[i]] + '\n';				
			}
			return str + '}';
		};
	
	o.attr = function(k){return o[k];};

	o.controller = function(k,v){
		if(!k || typeof k != 'string') return o;
		if(v && typeof v == 'object') return setSubController(k,v);
		if(v === null) return o.removeChild(k);
		return o.getElementById(k);
	};
	
	o.execute = function(){							
		var m = o.model();
		bExeEvent.initEvent('beforeexecute',true,true,arguments);
		o.dispatchEvent(bExeEvent);
		if(ns.debugTiming) console.log('execute: ' + o.id);
		if(m) m.sync.apply(this,arguments);		
		aExeEvent.initEvent('afterexecute',true,true,arguments);
		o.dispatchEvent(aExeEvent);
		o.childNodes.each(function(){
			if(this.attr('type')=='Controller' && this.attr('defaultNode'))
				this.execute();
		});
	};
	
	o.model = function(v){
		if(!v) return o.getElementById('model');
		else if(typeof v == 'object'){
			var n,attr={},nodes={};
			for(n in v){
				if(n == 'data')nodes[n] = v[n];
				else attr[n] = v[n];
			}
			attr.id = o.id+'Model';	
			attr.parentNode = o;  
			return new ns.Model(attr,nodes);
		}
	};
	
	o.view = function(v){
		if(!v) return o.getElementById('view');
		else if(typeof v == 'object'){
			v.id = o.id+'View';	
			v.parentNode = o;
			return new ns.View(v,{});
		}
	};
	
	(function(a,x){		
		var temp = a.oncreate,
			oncreate = function(e){	
				o.appendChild('model',o.model(x.model||{}));			
				o.appendChild('view',o.view(x.view||{}));			
				return e;
			};
		
		a.oncreate = ns.fMerge(a.oncreate,oncreate);
		a.type = 'Controller';

		ns.BaseObject.call(o,a,x);
		if(typeof o.onbeforeexecute == 'function')
			o.addEventListener('beforeexecute',o.onbeforeexecute);
		if(typeof o.onafterexecute == 'function')
			o.addEventListener('afterexecute',o.onafterexecute);
		o.oncreate = temp;
		o.toString = toString;
		o.path = register(o);
	})(a,x);
	
	return new function(){
		this.attr = o.attr;
		this.bind = o.addEventListener;
		this.controller = o.controller;
		this.execute = o.execute;
		this.model = o.model;		
		this.toString = toString;
		this.unbind = o.removeEventListener;
		this.view = o.view;
	};
	
};