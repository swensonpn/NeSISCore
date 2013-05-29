nesis.mvc.Model = function(a,x){
	var ns=nesis.mvc,o=this,store=nesis.core.store,key='nesisMVC',view,
		bSyncEvent=new ns.Event('MVC'),aSyncEvent=new ns.Event('MVC'),bSaveEvent=new ns.Event('MVC'),aSaveEvent=new ns.Event('MVC'),
		http=nesis.net.http,
		getCache = function(){ 
			var v = eval('('+store.get(key+o.id)+')'),msg='nesis.mvc.'+o.id+'.getCache:\n\t';
			if(v){
				var ts = new Date(v.stamp);	
				if(o.expires && o.expires < ts){
					if(ns.debugCache) console.log(msg + 'Content dated: ' + ts + '\n\tExpired: ' + o.expires + '\n\tupdate from server');
					return;
				}
				if(o.lastModified && o.lastModified > ts){
					if(ns.debugCache) console.log(msg + 'Content dated: ' + ts + '\n\tModified: ' + o.lastModified + '\n\tupdate from server');
					return;
				}	
				if(ns.debugCache) console.log(msg + 'Expires: ' + o.expires + '\n\tlastModified: ' + o.lastModified + '\n\tcacheDate: ' + ts + '\n\tcache: ' + JSON.stringify(v));
				o.contentType = v.type;
				return v.data;
			} 
			if(ns.debugCache) console.log(msg + 'Content not found update from server');
			return;					
		},
		setCache = function(v){
			var persist=false,now=new Date(),
				obj={persist:persist,stamp:now,type:o.contentType,data:v};
			if(o.expires || o.lastModified)obj.persist=true;
			store.set(key+o.id,JSON.stringify(obj),obj.persist);
			if(ns.debugCache) console.log("nesis.mvc." + o.id + ".setCache:\n\t" + JSON.stringify(obj));
		},
		toServer = function(opts){			
			if(navigator.onLine)
				http.ajax(o.remoteURL,opts);				
			else{//Untested
				var now = new Date(),reqId='onconnect'+o.id+now.getTime(),
				cb=function(){
					if(navigator.onLine)
						http.ajax(o.remoteURL,ajaxOpts);						
					else
						setTimeout(cb,this.mvc.ajaxReqCacheDelay);
				};
				ns[reqId] = setTimeout(cb,this.mvc.ajaxReqCacheDelay);
			}				
		},
		fromServer = function(res){
			//Future push expiration
			var data = (o.contentType == 'text/xml') ? res.responseXML : res.responseText;
			if(ns.debugAjax) console.log('Server Response: ' + data);
			if(data != getCache()){
				setCache(data);
				o.dispatchEvent('change');
				return data;
			}				
		};	
		toString = function(){
			var i=0,l,str = o.id + ":{\n",
			authItems = ['id','contentType','expires','remoteURL','oncreate','onchange','onbeforesave','onaftersave','childNodes'];
			for(l=authItems.length; i<l; i++){
				if(o[authItems[i]] instanceof ns.Collection){
					str += '\t' + authItems[i] + ': ' + o[authItems[i]].toString(1);
				}
				else str += '\t' + authItems[i] + ': ' + o[authItems[i]] + '\n';				
			}
		return str + '}\n';
		};
	
	o.attr = function(k){return o[k];};
	
	o.save = function(data){
		var argArr = Array.prototype.slice.call(arguments);
		bSaveEvent.initEvent('beforesave',true,true,arguments);		
		o.dispatchEvent(bSaveEvent);
		toServer({
			post:data,
			callback:function(res){
				argArr.unshift(fromServer(res));
				aSaveEvent.initEvent('aftersave',true,true,argArr);
				o.dispatchEvent(aSaveEvent);
				if(argArr[0]) view.render.apply(this,argArr);				
			}
		});
	};
	
	o.sync = function(){ 
		var cache = getCache(),argArr = Array.prototype.slice.call(arguments);	
		
		bSyncEvent.initEvent('beforesync',true,true,arguments);		
		
		if(!view) view = o.parentNode.view();
		o.dispatchEvent(bSyncEvent);	
		if(!cache)
			toServer({
				callback:function(res){ 
					argArr.unshift(fromServer(res));
					aSyncEvent.initEvent('aftersync',true,true,argArr);
					o.dispatchEvent(aSyncEvent);
					if(argArr[0]) view.render.apply(this,argArr);
				}
			});
		else{			
			argArr.unshift(cache); 
			aSyncEvent.initEvent('aftersync',true,true,argArr);
			o.dispatchEvent(aSyncEvent);			
			view.render.apply(this,argArr);
		}
	};
		
	
	(function(a,x){			
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
		ns.BaseObject.call(o,a,{});
		if(typeof o.onbeforesave  == 'function')
				o.addEventListener('beforesave',o.onbeforesave);
		if(typeof o.onaftersave  == 'function')
			o.addEventListener('aftersave',o.onaftersave);
		if(typeof o.onbeforesync  == 'function')
			o.addEventListener('beforesync',o.onbeforesync);			
		if(typeof o.onaftersyn  == 'function')
			o.addEventListener('aftersync',o.onaftersync);	
/*		
		if(o.parentNode)
			o.parentNode.addEventListener('execute',o.sync);
*/			
		
		try{
			if(!a.remoteURL && !x.data) throw Error("nesis.mvc." + o.id + ".contructor: remoteURL or data is required");
			else if(x.data) setCache(x.data);		
		}
		catch(err){			
			nesis.core.error.handle(err);
		}	
		
	})(a,x);
	
	return new function(){
		this.attr = o.attr;	
		this.bind = o.addEventListener;
		this.save = o.save;
		this.sync = o.sync;
		this.toString = toString;
		this.unbind = o.removeEventListener;
	};
};
/*		
fromServer = function(res){ 	
	//Maybe push expiration
	var data = (o.contentType == 'text/xml') ? res.responseXML : res.responseText;
	if(ns.debugAjax) console.log('Server Response: ' + data);
	return data;
//	setCache(data);
//	o.dispatchEvent('aftersync');
//? use this o.dispatchEvent('change');
//	view.render(data);
},
*/	

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