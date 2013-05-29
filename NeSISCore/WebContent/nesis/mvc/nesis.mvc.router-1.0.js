nesis.mvc.Router = function(a,x){
	var ns=nesis.mvc,o=this,
		doRoute = function(e){ 
			var path = location.hash || 'app',c,args=[],//args=[],
				popArg = function(path,args){
					var i = path.lastIndexOf('/');
						tok = path.substr(i+1);
						args.unshift(tok);
						path = path.substring(0,i);
						c = o.route(path);
						if(c instanceof Controller || c instanceof Application)
							c.execute(args);
						else if(i > -1)
							popArg(path,args);					
				};
			
			path = path.replace('#','');				
			c = o.route(path); 
			if(typeof c == 'object') c.execute(args);
			else popArg(path,args);
		},
		toString = function(tabLevel){
			var str = "Router: ";
			return str + o.childNodes.toString(tabLevel);
		};
	
	o.route = function(k,v){ 
		if(!v) return o.getElementById(k);
		else if(typeof v == 'object') o.appendChild(k,v);
		else if(v === null) o.removeChild(k);
	};
	
	
	(function(a,x){
		a = {id:'router'};
		ns.BaseObject.call(o,a,x);
		
		o.toString = toString;	
		window.addEventListener("hashchange",doRoute,true);
	})(a,x);
	
};