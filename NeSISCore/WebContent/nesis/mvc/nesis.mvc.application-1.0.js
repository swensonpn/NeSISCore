nesis.mvc.Application = function(x){
	var ns=nesis.mvc,o=this,r,
		toString = function(){
			var i=0,l,str = "Controller (" + o.id + "):{\n",
				authItems = ['id','oncreate','onchange','onbeforeexecute','onafterexecute','childNodes'];
			for(l=authItems.length; i<l; i++){
				if(o[authItems[i]] instanceof ns.Collection){
					str += '\t' + authItems[i] + ': ' + o[authItems[i]].toString(1);
				}
				else str += '\t' + authItems[i] + ': ' + o[authItems[i]] + '\n';				
			}
			return str + '\t' + r.toString(1) + '\n}';
		};

	o.router = function(k,v){
		if(!k) return r.toString();		
		return r.route(k,v);
	};
	
	
	(function(x){
		nesis._init();
		r = new ns.Router();
		a = {
			parentNode:null,
			id:'app',
			onbeforeexecute:x.onbeforeexecute || undefined,
			onafterexecute:x.onafterexecute || undefined
		};
		
		ns.Controller.call(o,a,x);		
	})(x);
	
	return new function(){
		this.attr = o.attr;
		this.bind = o.addEventListener;
		this.controller = o.controller;
		this.execute = o.execute;
		this.model = o.model;
		this.router = o.router;
		this.toString = toString;
		this.unbind = o.removeEventListener;
		this.view = o.view;
	};
};
