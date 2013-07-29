nesis.mvc.Router = function(options){
	var o=this,routes=[],handler,
	hashBang = function(e,href){
		console.log('hashband: ' + href);	
		e.preventDefault();		
		location.hash = '#' + href.split('?')[1];							
	},
	pushState = function(e,href){
		console.log('pushstate: ' + href);
		var args,loc = href.split('?'),r;
					
		args = parseArgs(loc[1]);
		args.url = href;
		r = findRoute(args.path);
		if(r){
			e.preventDefault();
			history.pushState(args,'',href);
			r.scope[r.callback](args);
		}		
	},
	findRoute = function(path){
		if(!path) return;  
		for(var i=0,l=routes.length; i<l; i++){
			if(path == routes[i].route) return routes[i];	
		}
	},
	parseArgs = function(qStr){
		var args={},pairs = qStr.split('&'),l=pairs.length,i=0,nv;
		for(; i<l; i++){
			nv = pairs[i].split('=');
			if(nv.length = 2) args[nv[0]] = nv[1];
		}
		return args;
	};


	o.addRoute = function(path,fname,scope){
		routes.push({
			route:path,
			callback:fname,
			scope:scope
		});
	};
	
	o.removeRoute = function(path){
		for(var i=0,l=routes.length; i<l; i++){
			if(path == routes[i].route) routes.splice(i,1);	
		}
	};
	
	o.toString = function(){
		var tab="\t\t",str="";
		str += tab + '\n' + tab +'Router(' + routes.length + '){\n';
		for(var i=0,l=routes.length; i<l; i++){
			str += tab + '\t' + routes[i].route + '\n';
		}
		return str + tab + '}\n';
	};
	
	
	//Constructor
	if(!history.pushState){
		handler = hashBang;
		window.addEventListener('hashchange',function(e){
			var args = parseArgs(location.hash.substr(1)),
				r = findRoute(args.path);
			
			if(r){
				e.preventDefault();	
				r.scope[r.callback](args);						
			}				
		},false);
	}
	else{
		handler = pushState;
		window.addEventListener('popstate',function(e){ 
			if(e.state && e.state.path){
				var r = findRoute(e.state.path);
				if(r) r.scope[r.callback](args);
			}
		},false);
	}
	
	
	if(document.addEventListener){		
			document.addEventListener('click',function(e){
				var href =  e.target.href || e.target.parentNode.href;		
				if(href){					
					handler(e,href);
				}
			},false);
	
	}	
};

/*
 var o=this,routes=[],handler,
		defaults={
			method:'hashBang' //hashbang || pushstate || auto
		},
		handleHashBang = function(rObj,args){
			rObj.scope[rObj.callback](args);
		},
		handlePushState = function(rObj,args,noHistory){
			//Future functionality when browser support improves
		};
	
	o.addRoute = function(path,fname,scope){
		routes.push({
			route:path,
			callback:fname,
			scope:scope
		});
	};
	
	o.handleRoute = function(path,noHistory){
		var l=routes.length-1;
		for(; l>-1; l--){ 
			if(path.match(routes[l].route)){		
				var argArr = path.replace(routes[l].route,'').split('/').slice(1),args={};
				while(argArr.length>0){var nv=argArr.shift().split(':'); args[nv[0]] = nv[1];}
				handler(routes[l],args,noHistory);
				break;
			}
		}		
	};
	
	o.removeRoute = function(path){
		
	};
	
	o.toString = function(){
		var tab="\t\t",str="";
		str += tab + '\n' + tab +'Router(' + routes.length + '){\n';
		for(var i=0,l=routes.length; i<l; i++){
			str += tab + '\t' + routes[i].route + '\n';
		}
		return str + tab + '}\n';
	};
	
	//Start Constructor
	for(var n in options){
		defaults[n] = options[n];
	}
	switch(defaults.method){
	case 'hashBang':
		handler = handleHashBang;
		break;
	case 'pushState':
		handler = handlePushState;
		break;
	default:
		if(!history.pushState)
			handler = handleHashBang;
		else
			handler = handlePushState;						
	}
	
	if(handler == handleHashBang)
		window.addEventListener("hashchange",function(e){
			var path = location.hash.substr(1) || 'app';
			o.handleRoute(path);
		},false);
	else
		//Goes ithe handlePopState functionality above
		;//document.addEventListener() for popstates and clicks
*/
