//temp comment
var nesis={
	//name spaces
	ds:{},
	gui:{},
	mvc:{},
	util:{},
	widg:{},
	
	//properties
	appId:'app',
	baseUrl:[location.protocol, '//', location.host, location.pathname].join(''),
	cfg:{
		root:'root',
		defaultRoute:'',
		debug:false,
		showHandlers:false,
		showTime:false,
		showBind:false,
		cache:false,
		l1CacheMax:50,
		l1CacheClearInt:5000,
		l1l2CacheLife:30000
	},
	
	//runtime objects
	cache:undefined,
	
	
	//functions	
	extend:function(a,b){//a extends b
		a.prototype = Object.create(b.prototype);
		a.constructor = a.Controller;
	},	
	fMerge:function(a,b){
		var aValid = a instanceof Function,
			bValid = b instanceof Function;
		if(aValid && bValid)
			return function(e){return a(b.apply(null,arguments));};
		else{
			if(aValid) return a;
			if(bValid) return b;
			return function(){};
		}
	},
	oMerge:function(a,b){
		for(n in a){a[n] = b[n] || a[n];}		
		return a;
	},
	getHtml:function(id){//get html for id
		var tgt=document.getElementById(id),clone,tNode;
		if(tgt){  
			clone = tgt.cloneNode(false);
			clone.innerHTML = tgt.innerHTML;
			tNode=document.createElement('div');
			tNode.appendChild(clone);
			return tNode.innerHTML;
		}
	},	
	isUrl:function(s){
		return /^((https?):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(s);
	},
	
	//constructor
	application:function(name,def){
		var ns=nesis,n;
		ns.appId=name;
		def.config = def.config || {};
		for(n in ns.cfg){ns.cfg[n] = def.config[n] || ns.cfg[n];}
		def.config = ns.cfg;
		
		//setup cache
		ns.cache = new ns.util.Cache({
			cache:ns.cfg.cache,
			l1Max:ns.cfg.l1CacheMax,
			clearInt:ns.cfg.l1CacheClearInt,
			l1Exp:ns.cfg.l1l2CacheLife
		});
		return new ns.mvc.Application(ns.cfg.root,def);
	}
};

/*
 * DATASOURCE
 */
nesis.ds.Datasource = function(a){
	var ns=nesis,o=this,cache=ns.cache,n,attr={}
		getKey = function(domId,url){return domId+':'+url;};
	
	o.select = function(args,callback){ 
		var data = cache.get(getKey(attr.domId,args.location)); 
		if(data){	
			if((!attr.expires && !attr.lastModified) ||
				(attr.expires && attr.expires > data.stamp) ||
					(attr.lastModified && attr.lastModified < data.stamp))
						return data.data;			
		}
		else if(args.path == attr['domId']){
			ns.util.Ajax(args.location,{
				callback:function(res){
					var k = getKey(args.path,args.location);
					cache.set(k,res.responseText,attr.persist);
					//args.html = k;
					args.html = cache.get(k).data;
					callback(args);
				}
			});			
		}
	};
	
	o.update = function(args){};
	
	//Constructor
	for(n in a){
		if(n == 'expires' || n == 'lastModified') attr.persist = true;
		attr[n] = a[n];
	}
	var html = nesis.getHtml(a.domId);  
	if(html)
		cache.set(getKey(a.domId,nesis.baseUrl),html,((a.expires || a.lastModified) ? true : false));
};

nesis.ds.Html=function(a){
	var ns=nesis.ds,o=this;
	
	//Constructor
	ns.Datasource.call(o,a);
};

/*Setup Inheritance */
(function(){nesis.extend(nesis.ds.Html, nesis.ds.Datasource);})();


nesis.ds.json=function(){};

nesis.ds.xml=function(){};


/*
 * GRAPHICAL USER INTERFACE
 */
nesis.gui.AjaxContainer = function(opt){
	try{
		var o=this;
		o.children().each(function(){
			if(this instanceof nesis.mvc.Controller){
				this.bind('beforeexecute',function(e){  
					var el = document.getElementById(o.attr('path')),elFC;
					if(el){
						while(el.firstChild && el.firstChild.nodeType != 1){
							el.removeChild(el.firstChild);
						}
						elFC = (!el.firstChild) ? document.createElement('div') : el.firstChild;					
						elFC.id = e.target.attr('path');	
					}
				});
			}
		});	
	}catch(err){
		alert('Crap: ' + err.message);
	}
};


nesis.gui.TypeAhead = function(opt){
	var o=this,m=o.model(),
		dflt={
			action:'search',
			bindTo:'.typeahead',
			fullForm:false,
			minChar:3,
			callback:undefined,
			preventSubmit:false,
			results:'.dropdown-menu'
		};
	
	var Widget = function(el,vw){
		var form=el.getAttribute('form'),args={},url,fn,cb,hfn,rBox;
		
		cb = {
			searchResult:function(html){
				if(typeof html == 'object') html = html.html;				
				var div = document.createElement('div');
				div.id=el.name + '-results';
				div.style.position = 'relative';
				div.innerHTML = html;
				rBox = nesis.widg.Dropdown.call(div.querySelector(dflt.results),cb.userSelect);			
				if(el.nextSibling){
					if(el.nextSibling.id = div.id)
						el.parentNode.replaceChild(div,el.nextSibling);
					else
						el.parentNode.insertBefore(div,el.nextSibling);
				}
				else el.parentNode.appendChild(div);
			},
			userSelect:function(){				
				el.value = this.innerHTML;
				if(typeof dflt.callback == 'function') dflt.callback.call(el,this);
			}
		};
		
		fn = {
			isForm:function(node){
				return(node && node.nodeName == "FORM") ? true : false;
			},
			validKey:function(k){
				if ((k >=65 && k <= 90) // letters
					    || (k >=48 && k <= 57) // digits
					    || k === 8 // backspace					   
					    || k === 46) return true; // delete
				return false;    
			}
		};
		
		hfn = {
			onSpecial:function(e){				
				if(e.keyCode == 13){//enter
					rBox.select();
					if(dflt.preventSubmit) e.preventDefault();
				}
				else if(e.keyCode == 9)//tab
					if(rBox) rBox = rBox.destroy();
			},
			fieldChange:function(e){
				if(this.value.length >= dflt.minChar){
					if(!fn.validKey(e.keyCode)){
						if(!rBox)return;
						switch(e.keyCode){
						case 40://next	
							rBox.next();
							break;
						case 38://prev
							rBox.prev(); 
							//keep cursor at end of field
							var tmp = e.target.value;
							e.target.value = '';
							e.target.value = tmp;
							break;										
						}						
						return;
					}					
					if(dflt.fullForm){
						for(var i=0,l=form.length; i<l; i++){ 
							if(form[i].value && form[i].name){
								args[form[i].name] = form[i].value;
								url.setParameter(form[i].name,form[i].value);
							}
						}
					}
					else{
						args[el.name] = el.value;
						url.setParameter(el.name,el.value);
					}
					
					args.action = dflt.action;
					url.setParameter('action',args.action);
					args.path = url.getParameter('path');
					args.location = url.toString();	
					var rslt = m.search(args,cb.searchResult);
					if(rslt) cb.searchResult(html);
				}
				else{
					if(rBox) rBox = rBox.destroy();
				};
			}			
		};
		
		//Constructor
		form = vw.select('form[id="' + form + '"]')[0] || el.parentNode;
		if(!fn.isForm(form)){				
			while(form = form.parentNode){
				if(fn.isForm(form)){break;}							
			}
			if(!form) throw "Form element not found";
		}
		
		url = new nesis.util.Url(form.action || location.href);		
		el.addEventListener('keyup',hfn.fieldChange,false);
		el.addEventListener('keydown',hfn.onSpecial,false);
		el.addEventListener('mouseup',hfn.fieldChange,false);
	};
	
	//Constructor
	dflt = nesis.oMerge(dflt, opt);

	//Must reinitialize the DOM widget each time section renders
	o.view().bind('beforerender',function(e){
		try{
			var vw=e.target,i=0,
				ipts=vw.select(dflt.bindTo),l=ipts.length;			
			for(; i<l; i++){ipts[i] = new Widget(ipts[i],vw);}
		}catch(err){
			console.log('nesis.gui.TypeAhead: ' + err.message);
		}		
	});
};

/*
 * MODEL, VIEW, CONTROLLER
 * Order determined by inheritance do not change
 */

/***** EVENT *****/
nesis.mvc.Event = function(eventType,data){
	if(!eventType || typeof eventType != 'string') return false;
	data = data || {};
	
	this.type = eventType;
	this.bubbles = data.bubbles || true;
	this.cancelable = data.cancelable || true;	
	this.arguments = data.arguments;
};


/***** NODE ******/
nesis.mvc.Node = function(a,x){
	var cf=nesis.cfg,ns=nesis.mvc,o=this,id,events={},nsStr='nesis.mvc.',top,
		children=new ns.NodeCollection(x||[]),
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
        if(cf.showBind || attr.debug) console.log(rslt + ': ' + msg);
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
	
	o.top = function(){
		if(top) return top;
		var p = o;
		do{
			if(!p.attr.parent){
				top = p;	
				break;
			}
		}
		while(p = p.attr.parent);
		return top;
	};
	
	o.trigger = function(e){
		var evt,bbl=true,eMsg = nsStr + 'trigger(';
		
		if(typeof e == 'string')
			evt = new ns.Event(e);
		else if(e instanceof ns.Event)
			evt = e;
		else 
			return;
			
		evt.target = e.target || o;	
	
		if(events[evt.type]){		
    		var i=0,l=events[evt.type].length;  
    		for(; i < l; i++){ 	    					
				bbl = events[evt.type][i].call(o,evt);							
				if(cf.showHandlers || attr.debug) console.log(eMsg + evt.type + '): ' + events[evt.type][i]);
				if(cf.showTime) console.log(eMsg + evt.type + '): fired');				
    		}
		}    		

    	if(evt.bubbles && attr.parent && bbl !== false) {
    		if(attr.parent.trigger) attr.parent.trigger(evt);
    	}
	};
	
	o.unbind = function(type,fn){
		var i=0,l,rslt='fail';
        if(o.events[type]) {  
            for(l=o.events[type].length; i < l; i++){
                if(o.events[type][i] == f){
                    o.events[type].splice(i, 1);
                    if(cf.debugEventUnbind || attr.debug) console.log(nsStr + 'unbind(' + type + ',' + fn +  ')');
                }
            }
        }       
	};
	
	//Start Constructor
	a = (a && typeof a == 'object') ? a : {};	
	for(var k in a){
		attr[k] = a[k];
	}		
	id = attr['id'];
	nsStr += id+'.';
	if(typeof attr.onchange == 'function') o.bind('change', attr.onchange);
	if(typeof attr.oncreate == 'function') o.bind('create', attr.oncreate);
	
	o.trigger('create');	
};


/***** NODE COLLECTION *****/
nesis.mvc.NodeCollection = function(x){
	var ns=nesis.mvc,o=this,i=0,arr=[];
	
	x = (x instanceof Array)? x : [];
	
	for(i=0,l=x.length; i<l; i++){
		if(x[i] instanceof ns.Node) arr.push(x[i]);
	}

	
	o.append = function(node){ 
		if(node instanceof ns.Node){
			arr.push(node);
			o.length = arr.length;
			return true;
		}
		return false;
	};
	
	o.each = function(fn){
		if(!fn || typeof fn != 'function') return;
		for(var i=0,l=arr.length; i<l; i++){ 
			fn.call(arr[i],i);
		}
	};
	
	o.find = function(k,v,deep){
		var rslt=[];
		for(var i=0,l=arr.length; i<l; i++){
			if(arr[i].attr([k]) == v){
				if(k == 'id') return arr[i];
				rslt.push(arr[i]);
			}			
			if(deep && arr[i].children && arr[i].children().length > 0){
				var tmp = arr[i].children().find(k,v,true);
				if(tmp instanceof ns.Node) return tmp;
				rslt = rslt.concat(tmp);
			}
		}
		return rslt;
	};
	
	o.length = arr.length;
	
	o.remove = function(node){
		for(i=0,l=arr.length; i<l; i++){
			if(arr[i] == node){
				arr.splice(i,1);
				o.length = arr.length;
				return node;
			}
		}		
	};
	
	o.toString = function(t){
		var tab="",str="";
		for(; t>0; t--){tab += '\t';}
		str += tab + 'Collection(' + arr.length + '){\n';
		for(var i=0,l=arr.length; i<l; i++){
			str += tab + '\t' + (arr[i].attr('type')||'Node') + '(' + (arr[i].attr('id') || '') + ')\n';
		}
		return str + tab + '}\n';
	};
};


/***** ROUTER *****/
nesis.mvc.Router = function(defaultRoute){ 
	var ns=nesis.mvc,o=this,routes=[],handler,dRoute=defaultRoute,
	hashBang = function(e,href){
		console.log('hashband: ' + href);	
		e.preventDefault();		
		location.hash = '#' + href.split('?')[1];							
	},
	pushState = function(e,href){
		console.log('pushstate: ' + href);
		var args,loc = href.split('?'),r;
						
		args = parseArgs(loc[1]); 
		args.location = href;
		
		r = findRoute(args.path);
		if(r){
			e.preventDefault();
			history.pushState(args,'',href);
			o.trigger(new ns.Event('beforeroute',{arguments:args}));
			r.scope[r.callback](args);
			o.trigger(new ns.Event('afterroute',{arguments:args}));
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
				o.trigger(new ns.Event('beforeroute',{arguments:args}));
				r.scope[r.callback](args);		
				o.trigger(new ns.Event('afterroute',{arguments:args}));
			}				
		},false);
	}
	else{
		handler = pushState;		
		window.addEventListener('popstate',function(e){ 
			var path,args={path:path,location:nesis.baseUrl};
			if(e.state && e.state.path){
				path = e.state.path;  
				args = e.state;
			}			
			var r = findRoute(path);		
			if(r){ 	
				o.trigger(new ns.Event('beforeroute',{arguments:args}));
				r.scope[r.callback](args);
				o.trigger(new ns.Event('afterroute',{arguments:args}));
			}
			else{
				var op = (nesis.baseUrl.split('?').length == 1) ? '?' : '&';
				location.href = nesis.baseUrl + op + 'path=' +dRoute;
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
	
	nesis.mvc.Node.call(o,{},{});
};

/*Setup Inheritance */
(function(){nesis.extend(nesis.mvc.Router, nesis.mvc.Node);})();


/***** CONTROLLLER *****/
nesis.mvc.Controller = function(k,v){ 
	var ns=nesis.mvc,o=this,a={},x=[],n,i,l;
	
	o.component = function(cName,opt){
		if(nesis.gui[cName] && typeof nesis.gui[cName]  == 'function')
			nesis.gui[cName].call(o,opt);
	};
	
	o.controller = function(k,v){
		var c = o.children('id',k);
		if(!v)
			return (c instanceof Controller) ? c : null;
		v.parent = o;
		c = new ns.Controller(k,v);
		o.append(c);
		return c;
	};
	
	o.execute = function(args){ 
		var m=o.model();
		args = args || {location:nesis.baseUrl,path:nesis.appId + '.' + nesis.cfg.root};
		o.trigger(new ns.Event('beforeexecute',{arguments:args}));
		if(nesis.cfg.showTime) console.log('execute: ' + o.attr('id'));
		if(m instanceof ns.Model)args = m.sync(args);
		o.trigger(new ns.Event('afterexecute',{arguments:args}));
		if(args !== false)
			o.children().each(function(){				
				if(this instanceof ns.Controller) this.execute(args);
			});
	};
	
	o.model = function(v){
		var m = (o.children) ? o.children('id',k+'Model') : undefined;
		if(!v) return m;
		
		if(typeof v == 'object'){
			var n,attr={};
			for(n in v){
				attr[n] = v[n];				
			}
			attr.id = k+'Model';			
			attr.parent = o;
			attr.domId = o.attr('path');
			if(m)o.remove(m);
			v = new ns.Model(attr);
			o.append(v);
			return v;
		}
	};
	
	o.view = function(v){
		var vw = (o.children) ? o.children('id',k+'View') : undefined;
		if(!v) return vw;
		
		if(typeof v == 'object'){
			var n,attr={},chldrn;
			for(n in v){
				(n == 'templates')? chldrn=v[n] :  attr[n] = v[n];
			}
			attr.id = k+'View';	
			attr.parent = o;
			attr.domId = o.attr('path');
			if(vw)o.remove(vw);
			v =  new ns.View(attr,chldrn);
			o.append(v);
			return v;
		}
	};
	
	//Constructor
	a.id = k;
	a.type = 'Controller';
	a.path = nesis.appId + '.' + ((v.parent) ? v.parent.attr('id')+'.' : '') + k;
	
	if(!v.model)x.push({type:'model',data:{}});
	if(!v.view)x.push({type:'view',data:{}});
	for(n in v){
		if('modelviewsubcontrollers'.search(n) > -1)			
			x.push({type:n,data:v[n]});		
		else
			a[n] = v[n];	
	}
	
	ns.Node.call(o,a,[]);
	
	for(i=0,l=x.length; i<l; i++){ 
		switch(x[i].type){
		case 'model':
			o.model(x[i].data);
			break;
		case 'view':
			o.view(x[i].data);
			break;
		case 'subcontrollers': 
			for(n in x[i].data)o.controller(n,x[i].data[n]);
		};
	}	
	
	if(typeof o.attr('onbeforeexecute')  == 'function')
		o.bind('beforeexecute',o.attr('onbeforeexecute'));
	if(typeof o.attr('onafterexecute')  == 'function')
		o.bind('afterexecute',o.attr('onafterexecute'));
	
	for(n in v.components){ 
		o.component(n,v.components[n]);
	}
};

/*Setup Inheritance */
(function(){
	nesis.mvc.Controller.prototype = Object.create(nesis.mvc.Node.prototype);
	nesis.mvc.Controller.constructor = nesis.mvc.Controller;
})();


/****** APPLICATION ******/
nesis.mvc.Application = function(k,v){
	var ns=nesis.mvc,o=this,r=new ns.Router(nesis.cfg.defaultRoute),
		addRoute=function(e){ 
		 	if(e.target instanceof ns.Controller && e.target != o){
		 		r.addRoute(e.target.attr('path'),'execute',e.target);}
		};
	   
	o.router = function(){
		return o.attr('router');
	};
	
	//Constructor
	v.oncreate = nesis.fMerge(addRoute,v.oncreate) || addRoute;		
	ns.Controller.call(o,k,v);
	o.attr('router',r);
	
	
};


/*Setup Inheritance */
(function(){
//	nesis.extend(nesis.mvc.Application, nesis.ds.Controller);
	nesis.mvc.Application.prototype = Object.create(nesis.mvc.Controller.prototype);
	nesis.mvc.Application.constructor = nesis.mvc.Application;
})();


/***** MODEL *****/
nesis.mvc.Model = function(a,x){
	var ns=nesis.mvc,o=this,ds=nesis.ds,view;
	
	o.save = function(data){};
	
	o.search = function(args,callback){
		return ds.select(args,callback)
	};
	
	o.sync = function(args){ 
		var html = ds.select(args,o.parent().execute);	
		if(html) args.html = html; else return false;
		o.trigger(new ns.Event('beforesync',{arguments:args}));		
		if(!args.html || args.html.indexOf('id="' + o.attr('domId') + '"') == -1) return false;
		o.trigger(new ns.Event('aftersync',{arguments:args}));	
		return o.view().render(args);		
	};

	o.view = function(){
		if(!view) view = o.parent().view();
		return view;
	};
	
	//Start Constructor
	a.type = 'Model';	
	
	if(a.expires !== undefined){
		a.expires = new Date(a.expires);
		if(a.expires == 'Invalid Date') a.expires = new Date(0);
	}
	if(a.lastModified !== undefined){
		a.lastModified = new Date(a.lastModified);
		if(a.lastModified == 'Invalid Date'){
			var now = new Date();
			a.lastModified = new Date(now.getTime() + 86400000);
		}
	}

	switch(a.contentType){
	case "text/xml":
		break;
	case "application/json":
		break;
	default:
		a.contentType = "text/html";
		ds = new ds.Html(a);
	}
	
	ns.Node.call(o,a,{});
	
	if(typeof o.attr('onbeforesave')  == 'function')
		o.bind('beforesave',o.attr('onbeforesave'));
	if(typeof o.attr('onaftersave')  == 'function')
		o.bind('aftersave',o.attr('onaftersave'));
	if(typeof o.attr('onbeforesync')  == 'function')
		o.bind('beforesync',o.attr('onbeforesync'));			
	if(typeof o.attr('onaftersync')  == 'function')
		o.bind('aftersync',o.attr('onaftersync'));	
};

/* Setup inheritance */  
(function(){
	nesis.mvc.Model.prototype = Object.create(nesis.mvc.Node.prototype);
	nesis.mvc.Model.constructor = nesis.mvc.Model;
})();


/****** VIEW ******/
nesis.mvc.View = function(a,x){
	var ns=nesis.mvc,o=this,frag,oNode,
		nodeSearch = function(needle,all){
			var hayStack = frag || oNode;
			if(all){
				return hayStack.querySelectorAll(needle);
			}
			return hayStack.querySelector(needle);
		},
		nodeReplace = function(newNode,oldNodeId){
			if(oldNodeId){
				var oldNode = oNode.getElementById(oldNodeId);
				if(oldNode) oldNode.parentNode.replaceChild(newNode,oldNode);
			}
			else{
				oNode = document.getElementById(o.attr('domId'));
				oNode.parentNode.replaceChild(newNode,oNode);	
			}
		};
	
	o.select = function(qStr){
		return nodeSearch(qStr,true);
	};
	
	o.model = function(){
		if(!model) model = o.parent().model();
		return model;
	};
	
	o.render = function(args){		
		var div = document.createElement('div'),aId;
		
		frag = document.createDocumentFragment();
		div.innerHTML = args.html;
		while(div.hasChildNodes()){
			if(div.firstChild.nodeType != 1) div.removeChild(div.firstChild);
			else frag.appendChild(div.firstChild);
		}
		
		try{	
			o.trigger(new ns.Event('beforerender',{arguments:args}));
			if(args.action) aId = args.action + '-data';
			nodeReplace(frag,aId);
//			oNode = document.getElementById(o.attr('domId'));
//			oNode.parentNode.replaceChild(frag,oNode);	
			o.trigger(new ns.Event('afterrender',{arguments:arguments}));
		}catch(err){
			err.message = "nesis.mvc." + o.attr('id') + ".render: document.getElementById('" + o.attr('domId') + "') returned null";
			console.log(err.message);
//			nesis.util.error.handle(err);
		}
		frag = null;
		return args;	
	};
	
	//Start Constructor
	a.type = 'View';
	
	ns.Node.call(o,a,{});
	
	if(typeof o.attr('onbeforerender')  == 'function')
		o.bind('beforerender',o.attr('onbeforerender'));
	if(typeof o.attr('onafterrender')  == 'function')
		o.bind('afterrender',o.attr('onafterrender'));
};

/* Setup inheritance */ 
(function(){
	nesis.mvc.View.prototype = Object.create(nesis.mvc.Node.prototype);
	nesis.mvc.View.constructor = nesis.mvc.View;
})();


/*
 * UTILITY
 */

/***** AJAX ******/
nesis.util.Ajax = function(url,options){
	var defaults = {
			callback:function(){},
			defer:false
		},		
		ajaxObj,
		xmlHttp = function(url,opts){//same domain request object
			var reqObj;
			
			this.send = function(){
				var method = (opts.post) ? "post" : "get",
					params = "";
				
				if(opts.post){
					for(name in opts.post){
						params += name + "=" + opts.post[name] + "&";
					}
				}
				
				reqObj.onreadystatechange = function(){
					if(reqObj.readyState == 4 && (reqObj.status == 200 || reqObj.status == 304)){	
						opts.callback(reqObj);
					}
				};

				reqObj.open(method, url, true);
				reqObj.setRequestHeader("X-Requested-With","XMLHttpRequest");//no support in PS
				if(opts.post) reqObj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				reqObj.send(params);
			};
			
			if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
				reqObj=new XMLHttpRequest();
			}
			else{// code for IE6, IE5
				try{
					reqObj=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e){};
			}
			if(!reqObj) throw Error("nesis.net.http.ajax.xmlHttp: Failed to initialize request object");
			
			reqObj.onerror = function(e){
				var msg = (reqObj.status == 0 || reqObj.status == null)? 'Security Violation cross-domain':reqObj.statusText;
				console.log("nesis.net.http.ajax.xmlHttp.onerror: Status=" + reqObj.status + " ReadyState=" + reqObj.readyState + " " + msg);
			};			
		},
		jsonp = function(url,opts){//cross domain request object
			var callId = (new Date().getTime()),
				doGet = function(url,callId){
			
					var div = document.createElement('div'),
						script = document.createElement('script');				

					document.body.appendChild(div);

					script.type = "text/javascript";
					script.src = url;
					
					div.id = "jsonpDiv" + callId;						
					div.appendChild(script);					
				},
				doPost = function(url,callId,post){
			
					var div = document.createElement('div'), 
						html = '<iframe name="ifr' + callId + '"></iframe>';
		 
					html += '<form target="ifr' + callId + '" method="POST" action="' + url + '" id="frm' + callId + '">';
					
					for(var name in post){
						html += '<input name="' + name + '" value="' + post[name] + '"/>';
					}
					html += '</form>';

					div.id = "jsonpDiv" + callId;
					div.style.display = "none";
					div.innerHTML = html;
					document.body.appendChild(div);
						
					nesis.net.http["timeout" + callId] = setTimeout('console.log("timeout");',4000);
					document.getElementById("frm" + callId).submit();
					
				};
			
			url += (url.search(/\?/) > -1)? "&" : "?";
			url += "async=true&jsoncallback=call" + callId;
			
			if(opts.post){ 			
				nesis.net.http["call"+callId] = function(rObj){
					try{
						opts.callback(rObj);
						var tOutName = rObj.callBackName.replace(/call/,"timeout");
						clearTimeout(nesis.net.http[tOutName]);
						document.body.removeChild(document.getElementById(rObj.callBackName.replace(/call/,"jsonpDiv")));
					}catch(e){
						Error("JSONP POST ERROR: " + e.message);
					}
				};
				this.send = function(){
					doPost(url, callId,opts.post);
				};					
			}
			else{					
				nesis.jsonp["call"+callId] = function(rObj){
					try{
						opts.callback(rObj);						
						document.body.removeChild(document.getElementById(rObj.callBackName.replace(/call/,"jsonpDiv")));
					}catch(e){
						Error("JSONP GET ERROR: " + e.message);
					}
				};
				this.send = function(){
					doGet(url,callId);
				};			
			}
							
		};
		
	this.send = function(cb){
		defaults.callback = cb || defaults.callback;
		ajaxObj.send();
	};
	
	
	//overide defaults
	if(Object.prototype.toString.call( options ) === "[object Object]"){
		for(var name in options){
			defaults[name] = options[name];
		}
	}
	else{
		throw Error("nesis.net.http: param options must be type Object");
	}
	
	//fix url fragments
	if(url.indexOf('http') != 0) url = location.protocol + '//' + location.host + '/' + url;
	
	//create universal object		
	ajaxObj = (url.search(window.location.host) != -1)? new xmlHttp(url, defaults) : new jsonp(url,defaults);

		
	//if not deffered call requet.
	if(!defaults.defer) this.send();
	
	
};

/***** CACHE *****/
nesis.util.Cache = function(options){
	var ns=nesis.util,o=this,n,lookup={},l1=[],pfx,
		l2=sessionStorage || {},l3=localStorage || {},
		dflts={			
			cache:false,
			prefix:'nesis.util.Cache.',
			l1Max:50,
			l1Exp:30000,
			clearInt:5000
		},
		createIndex=function(){
			lookup={};
			for(var i=0,l=l1.length; i<l; i++){lookup[l1[i].key] = l1[i];}
		},
		hashCode = function(s){
			  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
		};
	
	o.clear = function(){
		l1=[];
		l2={};
		l3={};
	};

	o.get = function(key){
		var hash = hashCode(key); 
		if(lookup[hash]){
			var tmp = lookup[hash];
			o.clear();
			return tmp;		
		}
		if(l2[hash])return JSON.parse(l2[hash]);
		if(l3[hash]) return JSON.parse(l3[hash]);
		return undefined;
	};
	o.set = function(key,data,persist){			
		var obj={key:key,stamp:new Date(),data:data},
			hash = hashCode(key); 
		
		(lookup[key])? l1[lookup[hash]] = obj : lookup[hash] = l1[l1.length] = obj;
		if(!dflts.cache) return;
		(persist) ? l3[hash] = JSON.stringify(obj) : l2[hash] = JSON.stringify(obj);
	};
	
	o.toString = function(){
		var str = 'Cache:l1[\n',n;
		for(var i=0,l=l1.length; i<l; i++){
			str += '\t{\n';
			for(n in l1[i]){
				str += '\t\t' + n + ': ' + l1[i][n] + '\n';
			}
			str += '\t}\n';
		}
		str += ']\nCache:l2{\n';
		for(n in l2){
			str += '\t' + n + ': ' + l2[n] + '\n';			
		}
		str += '}\nCache:l3{\n';
		for(n in l3){
			str += '\t' + n + ': ' + l3[n] + '\n';
		}
		return str + '}';
	};
	
	//Start Constructor
	for(n in options){dflts[n]=options[n];}
	pfx = dflts.prefix;
	
	//Garbage Collector
	setInterval(function(){
		var t = new Date(new Date().getTime()-dflts.l1exp);
		l1.sort(function(a,b){return b.stamp-a.stamp;});
		//while(l1.length > dflts.l1Max){l1.pop();}
		while(l1.length > 0){l1.pop();}
		createIndex();
		if(typeof(Storage) == 'undefined'){
			l2={}; l3={};
		};
	},dflts.clearInt);
};

nesis.util.error = function(){this.handler=function(){};};

nesis.util.GarbageCollector = function(){
	//http://fitzgeraldnick.com/weblog/40/
	//This could be a good way to cleanup event handlers on the DOM (components & views)
};

nesis.util.Url = function(urlStr){
	var o=this,urlValue,qStr;
	
	o.getParameter = function(name){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(qStr);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	
	o.setParameter = function(n,v){
		urlValue += (urlValue.indexOf('?')) ? '&' : '?';
		urlValue += n + '=' + v;
	};
	
	o.toString = function(){return urlValue;};
	
	urlValue = urlStr || location.href;
	qStr = urlValue.substr(urlValue.indexOf('?'));
};

(function(){nesis.extend(nesis.util.Url, String);})();

/*
 * WIDGET
 */
nesis.widg.Dropdown = function(callback){
	var o=this,hfn,li,i,l,active,cb;
	
	hfn = {		
		onClick:function(e){
			e.preventDefault();	
			e.stopPropagation();
			for(i=0; i<l; i++){
				if(li[i] == e.target){
					li[i].parentNode.className = 'active'; 
					active = i;
				}
				else
					li[i].parentNode.className = '';
			}
			o.select();
		}
	};
	
	o.destroy = function(){		
		o.removeEventListener('click',hfn.onClick);
		o.parentNode.removeChild(o);		
		return o = null;
	};
	
	o.next = function(){
		li[active].parentNode.className = '';
		active = (li[active + 1]) ? active + 1 : 0;
		li[active].parentNode.className = 'active';
	};
	
	o.prev = function(){
		li[active].parentNode.className = '';
		active = (li[active - 1]) ? active - 1 : li.length - 1;
		li[active].parentNode.className = 'active';
	};
	
	o.select = function(){
		cb.call(li[active]);
		o.destroy();
	};
	
	//Construct
	if(typeof callback == 'function') cb = callback;
	o.setAttribute('tabindex','-1');
	li = o.querySelectorAll('a');
	l = li.length;

	for(i=0; i<l; i++){	
		if(li[i].parentNode.className.indexOf('active') > -1) active=i;
	}
	o.addEventListener('click',hfn.onClick,false);
	return o;
};
