nesis.mvc.Model = function(a,x){
	var ns=nesis.mvc,o=this,store=nesis.core.store,key='nesisMVC',view,
		http=nesis.net.http,
		getCache = function(){ 
			var v = eval('('+store.get(key+o.attr('id'))+')'),msg='nesis.mvc.'+o.attr('id')+'.getCache:\n\t';
			if(v){
				var ts = new Date(v.stamp);	
				if(o.attr('expires') && o.attr('expires') < ts){
					if(ns.debugCache) console.log(msg + 'Content dated: ' + ts + '\n\tExpired: ' + o.attr('expires') + '\n\tupdate from server');
					return;
				}
				if(o.attr('lastModified') && o.attr('lastModified') > ts){
					if(ns.debugCache) console.log(msg + 'Content dated: ' + ts + '\n\tModified: ' + o.attr('lastModified') + '\n\tupdate from server');
					return;
				}	
				if(ns.debugCache) console.log(msg + 'Expires: ' + o.attr('expires') + '\n\tlastModified: ' + o.attr('lastModified') + '\n\tcacheDate: ' + ts + '\n\tcache: ' + JSON.stringify(v));
				o.attr('contentType',v.type);
				return v.data;
			} 
			if(ns.debugCache) console.log(msg + 'Content not found update from server');
			return;					
		},
		setCache = function(v){
			var persist=false,now=new Date(),
				obj={persist:persist,stamp:now,type:o.attr('contentType'),data:v};
			if(o.attr('expires') || o.attr('lastModified'))obj.persist=true;
			store.set(key+o.attr('id'),JSON.stringify(obj),obj.persist);
			if(ns.debugCache) console.log("nesis.mvc." + o.attr('id') + ".setCache:\n\t" + JSON.stringify(obj));
		},
		toServer = function(opts){			
			if(navigator.onLine)
				http.ajax(o.attr('remoteURL'),opts);				
			else{//Untested
				var now = new Date(),reqId='onconnect'+o.attr('id')+now.getTime(),
				cb=function(){
					if(navigator.onLine)
						http.ajax(o.attr('remoteURL'),ajaxOpts);						
					else
						setTimeout(cb,this.mvc.ajaxReqCacheDelay);
				};
				ns[reqId] = setTimeout(cb,this.mvc.ajaxReqCacheDelay);
			}				
		},
		fromServer = function(res){
			//Future push expiration
			var data = (o.attr('contentType') == 'text/xml') ? res.responseXML : res.responseText;
			if(ns.debugAjax) console.log('Server Response: ' + data);
			if(data != getCache()){
				setCache(data);
				o.trigger('change');				
				return data;
			}				
		};	
		
	
	o.save = function(data){
		var argArr = Array.prototype.slice.call(arguments);		
		o.trigger(new ns.Event('beforesave',{arguments:arguments}));
		toServer({
			post:data,
			callback:function(res){
				argArr.unshift(fromServer(res));
				o.trigger(new ns.Event('aftersave',{arguments:arguments}));
				if(argArr[0]) view.render.apply(this,argArr);				
			}
		});
	};
	
	o.sync = function(args){ 
		args.data = getCache(),
			evt = new ns.Event('beforesync',{arguments:args});						
	
		if(!view) view = o.parent().view();
	
		o.trigger(evt);	
		if(!args.data)
			toServer({
				callback:function(res){ 
					args.data = (o.attr('contentType') == 'text/json') ? JSON.parse(fromServer(res)) : fromServer(res);		
					o.trigger(new ns.Event('aftersync',{arguments:args}));
					view.render(args)

				}
			});
		else{	
			if(o.attr('contentType') == 'text/json') args.data = JSON.parse(args.data);			
			o.trigger(new ns.Event('aftersync',{arguments:args}));	
			view.render(args);
		}
	};	
	
	//Start Constructor
	a.contentType = a.contentType || 'text/html';	
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
		
			
	//ns.extend(a,b);
	ns.Node.call(o,a,{});
	if(typeof o.onbeforesave  == 'function')
			o.bind('beforesave',o.attr('onbeforesave'));
	if(typeof o.onaftersave  == 'function')
		o.bind('aftersave',o.attr('onaftersave'));
	if(typeof o.onbeforesync  == 'function')
		o.bind('beforesync',o.attr('onbeforesync'));			
	if(typeof o.onaftersyn  == 'function')
		o.bind('aftersync',o.attr('onaftersync'));	

//		if(o.parentNode)
//			o.parentNode.addEventListener('execute',o.sync);
		
	try{
		if(!a.remoteURL && !a.data) throw Error("nesis.mvc." + o.attr('id') + ".contructor: remoteURL or data is required");
		else if(a.data) setCache(a.data);		
	}
	catch(err){			
		nesis.core.error.handle(err);
	}	
};
//Setup inheritance  
nesis.mvc.Model.prototype = Object.create(nesis.mvc.Node.prototype);
nesis.mvc.Model.constructor = nesis.mvc.Model;

/*
Model = {
	id:'model',
	type:'model',
	contentType:				//text/html //text/json
	expires:					//How long to save. Empty session.  Date persistent. Today=Session,Past=Never,Future=Persistent
	remoteURL:string,			//If empty assume sync.  No data storage
	oncreate:function(e){},
	onchange:function(e){},
	onbeforesave:function(e){},
	onsave:function(e){},		//Final Private.  Leave as event.  Could be called from view or conroller.
	onaftersave:function(e){},
	data:Collection				//Should be json object or html.
}


*/

/*NOTES:
 * 1. Must handle html for backward compatibility and json for future compatibility. XML?
 * 2. Must handle caching
 * 3. Must be able to get data via ajax or understand static views
 * 4. Must handle templates or no templates
 */

/*
 * 
 */