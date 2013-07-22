nesis.mvc.Model = function(a,x){
	var ns=nesis.mvc,o=this,id=a.id,cacheKey='nesis.mvc.template.'+id,view,cObj;
	
	o.save = function(data){
		o.trigger(new ns.Event('beforesave',{arguments:arguments}));
				
		nesis.net.http.ajax(o.attr('url'),{
			post:data,
			callback:function(res){
				var cType = o.attr('contentType');
				cObj.data = (cType == 'text/xml') ? res.responseXML : res.responseText;
				cObj.data = (cType == 'text/json') ? JSON.parse(cObj.data) : cObj.data;
				cObj = ns.cache.set(cacheKey,cObj);  
				if(cObj.data){			
					args = {data:cObj.data};
					o.trigger(new ns.Event('aftersave',{arguments:args})); 
					o.view().render(args);	
				}
			}
		});	
	};
	
	o.sync = function(args,refresh){ 
		refresh = refresh || args.refresh;
		o.trigger(new ns.Event('beforesync',{arguments:args}));		
		
		cObj.callback = function(res){
			var cType = o.attr('contentType');
			cObj.data = (cType == 'text/xml') ? res.responseXML : res.responseText;
			cObj.data = (cType == 'text/json') ? JSON.parse(cObj.data) : cObj.data;
			cObj = ns.cache.set(cacheKey,cObj);
			if(cObj.data){				
				args.data = cObj.data;
				o.trigger(new ns.Event('aftersync',{arguments:args}));
				o.view().render(args);	
			}
		};
		
		if(cObj.url){
			var qStr = '?';
			for(var n in args){qStr += n + '=' + args[n] + '&';}
			cObj.url = cObj.url.split('?')[0] + qStr;
		}
		
		cObj = ns.cache.get(cacheKey,cObj,refresh); 
		if(cObj.data){
			args.data = cObj.data;
			o.trigger(new ns.Event('aftersync',{arguments:args}));		
			return o.view().render(args);
		}
	};
	
	o.view = function(){
		if(!view) view = o.parent().view();
		return view;
	};
	
	//Start Constructor
	a.contentType = a.contentType || 'text/html';	
	a.type = 'Model';
	a.datasource = (a.url) ? ns.datasource.ajax : ns.datasource.dom;
	
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
		
	ns.Node.call(o,a,{});
	
	o.append = undefined;
	o.children = undefined;
	o.find = undefined;
	o.remove = undefined;
	
	cObj = {
			data:a.data,
			domId:a.domId,
			url:a.url,
			datasource:a.datasource,
			persist:a.persist,
			lastModified:a.lastModified,
			expires:a.expires
		};
	
	if(typeof o.onbeforesave  == 'function')
			o.bind('beforesave',o.attr('onbeforesave'));
	if(typeof o.onaftersave  == 'function')
		o.bind('aftersave',o.attr('onaftersave'));
	if(typeof o.onbeforesync  == 'function')
		o.bind('beforesync',o.attr('onbeforesync'));			
	if(typeof o.onaftersync  == 'function')
		o.bind('aftersync',o.attr('onaftersync'));	
		
	try{
		if(!a.url && !a.domId && !a.data) throw Error("nesis.mvc." + o.attr('id') + ".contructor: remoteURL or data is required");
		else if(a.data) ns.cache.set(cacheKey, cObj);		
	}
	catch(err){			
		nesis.core.error.handle(err);
	};	
};
//Setup inheritance  
nesis.mvc.Model.prototype = Object.create(nesis.mvc.Node.prototype);
nesis.mvc.Model.constructor = nesis.mvc.Model;