//nesisCore framework Wed, 19 Jun 13 00:14:14 +0000

//Package: nesis/nesis.js
nesis = {	
	_init:function(opts){
		opts = opts || {};
			
		document.domain = opts.domain || location.host;
		
		//Displays general runtime messages in the console
		nesis.debugOn = opts.debugOn || true;
		
		/*nesis.core.store - Manages the browsers data store
		 *  debug: true to display console messages
		 */
		this.core.store._init({
			debug:opts.storeDebug || false,
			flush:opts.storeFlush || false
		});
		
		/*nesis.core.error - Handles error logging 
		 * logLevels:
		 * 	2 development: write to console
		 * 	1 testing: sends log messages to server immediately
		 * 	0 production: retains errors on the browser. Only send to server when requested
		 * 
		 * maxLogSize
		 *  Maximum number of errors to save in the local log
		 */
		this.core.error._init({
			logLevel:opts.logLevel || 0,
			maxLogSize:opts.logSize || 20,
			remoteUrl:opts.logSubmit || location.host
		});
		
		/*nesis.mvc - Model,View,Controller framework
		 *  debugTiming: true to write events that fire a handler
		 *  debugEventFired: true to write runtime events to the console as they fire
		 *  debugEventBind: true to write events added to objects
		 *  debugEventUnbind: true to write events removed from objects
		 *  debugCache: true to write cache management messages
		 *  
		 *  ajaxReqCacheDelay: When offline how long until attepting request again.
		 */
		this.mvc.debugTiming = opts.debugTiming || false;
		this.mvc.debugEventFired = opts.debugHandlers || false;
		this.mvc.debugEventBind = opts.debugBind || false;
		this.mvc.debugEventUnbind = opts.debugUnbind || false;
		this.mvc.debugCache = opts.debugCache || false;
		this.mvc.debugAjax = opts.debugAjax || false;
		
		this.mvc.ajaxReqCacheDelay = opts.ajaxRetry || 2000;
	},
	core:{},
	net:{}	
};

//Package: nesis/core/nesis.core.error-1.0.js
/*
 * OBJECT:nesis.core.error
 * DESCRIPTION:Handles error logging
 * DEPENDANCY: nesis.net,
 * 			   nesis.core.store
 */
nesis.core.error = {
	key:"nesisCoreError",//Local Storage location
	logLevel:0,//0=production,1=testing,2=dev
	maxLogSize:20,//Max number of errors in the log
	remoteUrl:"",
	_init:function(options){
		for(i in options){this[i] = options[i];} 
		if(!nesis.debugOn)//This suppresses uncaught errors.  In debugging uncaught errors should be allowed to break the application
			window.onerror = function(msg,url,line){
				if(msg && url && line)
					nesis.core.error.log({name:'Error',message:msg,fileName:url,lineNumber:line});
				return true;
			};
	},
	handle:function(e){ 
		var msg = Date() + '\n\t' + e.name + ': ' + e.message;
		if (e.stack) { //Firefox & Chrome provide file and lines
		  var lines = e.stack.split('\n');
	      for (var i=0, len=lines.length; i<len; i++) { 
	        if (lines[i].match(/http[.]*/i)) {	
	          msg += '\n\tLocation: ' + lines[i].substr(lines[i].indexOf('http')) + '\n';
	        }
	      }
		}
		this.log(msg);
	},
	log:function(msg){
		var db = nesis.core.store,
			key = nesis.core.error.key,//'nesisCoreError',
			errors = [];
		
		if(this.logLevel < 2){
			if(db.supported){//store locally
				var	savedErr = db.get(key); 					
				errors = (savedErr)? savedErr : errors;					
				errors.push(msg); 
				while(errors.length > this.maxLogSize){errors.shift();}
				db.set(key,errors,true);
			}
			else
				errors.push(msg);
		}
		if(this.logLevel == 1)this.submit(errors.join('\n'));//send immediately
		else if(this.logLevel == 2)console.log('%c'+msg,'color:FireBrick;');
	},
	submit:function(msg){
	    var clearLog = function(){
	    	nesis.core.store.clear(nesis.core.error.key); 	    	
	    };
	    
		if(!this.remoteUrl)console.log('Remote URL not set');
		else{
			try{
				nesis.net.http.ajax(this.remoteUrl,{post:{"errorList":msg},callback:clearLog});
			}
			catch(e){
				console.log("nesis.core.error.sumbit: Error sending log\n\t" + e.message);
			}
		}
	}
};



//Package: nesis/core/nesis.core.browser-1.0.js
/*
 * METHOD:nesis.core.browser
 * DESCRIPTION:Returns information about the current web browser
 * DEPENDANCY: None
 * @PARAM:Void
 * @RETURN:Void
 */
nesis.core.browser = function(){
	var N= navigator.appName, ua= navigator.userAgent, tem;
	var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
	return M;
};
	

//Package: nesis/core/nesis.core.cache-1.0.js
nesis.core.cache = function(options){
	var ns=nesis.core,o=this,lookup={},l1=[],
		l2,l3,
		dflts={
			l1Max:50,
			l1Exp:30000,
			clearInt:5000
		},
		createIndex=function(){
			lookup={};
			for(var i=0,l=l1.length; i<l; i++){lookup[l1[i].key] = l1[i];}
		};
	
	o.clear = function(){
		l1=[];
		l2={};
		l3={};
	};
	
	o.get = function(key,obj,refresh){ 
		if(refresh){
			obj.data = undefined;
			return o.set(key,obj);
		}
		else{
			//if(l1[key])return l1[key];
			if(lookup[key]) return lookup[key];
			if(l2[key])return JSON.parse(l2[key]);
			if(l3[key]){
				var tmp = JSON.parse(l3[key]),t= new Date();
				if((obj.lastModified && tmp.stamp>obj.lastModified)||(obj.expires && tmp.stamp < obj.expires))
					return o.set(key,obj); 
				return tmp;
			}		
			return o.set(key,obj);
		}
	};
	
	o.set = function(key,obj){ 
		obj.key = key;
		obj.stamp = new Date(); 
		if(obj.datasource && !obj.data) obj = obj.datasource(obj);
	
		if(!obj.data) return obj;//non-blocking implementation		//Big fat trial and error
		if(lookup[key]) l1[lookup[key]] = obj;
		else
			lookup[key] = l1[l1.length] = obj;

		(obj.persist) ? l3[key] = JSON.stringify(obj) : l2[key] = JSON.stringify(obj);

		return obj;
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
		str += '}\nCache:l3{\n'
		for(n in l3){
			str += '\t' + n + ': ' + l3[n] + '\n';
		}
		return str + '}';
	};

	//Start Constructor
	for(var n in options){dflts[n]=options[n];}
	l2=sessionStorage || {};
	l3=localStorage || {};

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

/* 
Thoughts.
var cache = l1 a memory cache (needs some limitations)
sessionStorage = l2 

save - persistent localstorage
dom - <script>
remote - ajax

obj = {
	persist=true/false
	lastModified=date
	expires=date
	url=remoteURL for ajax
	id=domId
	data=data
	callback=function
}
*/

//Package: nesis/core/nesis.core.store-1.0.js
nesis.core.store = {
	supported:false,
	_init:function(options){
		this.supported = (typeof(Storage) && JSON)? true : false;
		
		this.debug = options.debug || false;
		if(options.flush) this.flush();
		
		if(this.debug) console.log("nesis.core.store.supported: " + this.supported);
	},
	clear:function(key){
		if(localStorage[key]) localStorage[key] = null;
		else if(sessionStorage[key]) sessionStorage[key] = null;
		if(this.debug) console.log("nesis.core.store.clear: " + key + " has been cleared");
	},
	flush:function(){
		localStorage.clear();
		sessionStorage.clear();
	},
	get:function(key){
		var value,store;		
		if(sessionStorage[key]){ 
			value = eval(sessionStorage[key]);
			store = 'sessionStorage';
		}
		else if(localStorage[key]){
			value = eval(localStorage[key]);
			store = 'localStorage';
		}
		if(this.debug) console.log("nesis.mvc.model.get: \n\t" + store + "." + key + "=" + value);
		return value;
	},
	set:function(key,value,persist){
		var store = (persist === true)? localStorage : sessionStorage;
		store[key] = JSON.stringify(value);
		if(this.debug) console.log("nesis.core.store.set: persistent=" + persist + ", " + key + "=\n\t" + value);
	}
};

//Package: nesis/net/nesis.net.http-1.0.js
nesis.net.http = {
	ajax:function(url,options){
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
		
		
	},
	pjax:function(url,options){
		//extends ajax with history
	},
	reload:function(){},
	redirect:function(){}
};

//Package: nesis/mvc/nesis.mvc-1.0.js
nesis.mvc = (function(){
	var o=this,ns=nesis,c=ns.core;

	//Timing debugger
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			console.log('document ready: fired');
		},true);
		window.addEventListener('load',function(){
			if(this.debugTiming) console.log('window load: fired');
		},true);
	}
	
	//broken ?
	o.extend = function(a,b){
		for (var k in b) {
		    if (b.hasOwnProperty(k)) {
		      a[k] = b[k];
		    }
		  }
		  return a; 
	};
	
	o.fMerge = function(a,b){
		var aValid = a instanceof Function,
			bValid = b instanceof Function;
		if(aValid && bValid){
			return function(e){
						return a(b.apply(null,arguments));					
					};
		}
		else{
			if(aValid) return a;
			if(bValid) return b;
			return function(){};
		}
	};
	
	o.gui = {};
	o.datasource = {};
	
//	o.tpl = c.template.tmpl;
	o.cache = new c.cache(); 
	o.error = c.error;
	
	return o;	
})();
	



//Package: nesis/mvc/gui/nesis.mvc.gui.tabsAjax-1.0.js
nesis.mvc.gui.tabsAjax = function(e){	

	if(!e.target instanceof View)return;
	
	var frag=e.target,tabBar=frag.querySelector('.mvc-tab-list'),tabs=[],a,li,content=frag.querySelector('.mvc-tab-content'),
		handler=function(e){
			var href = e.target.getAttribute('href'),i=0,l=tabs.length;
			for(var i=0; i<l; i++){						
				tabs[i].className = (tabs[i].getAttribute('href') == href) ? 'active' : '';							
			}		
			content.id = href.slice(1,-1);
		};

	frag.parent().children().each(function(){
		var o=this,a=document.createElement('a'),id=this.attr('id');
		if(o.attr('type') == 'Controller'){
			this.bind('beforerender',function(e){
				if(e.target != o.view()) return;				
				var href = o.attr('path'),i=0,l=tabs.length;
				content.id = href;
				for(var i=0; i<l; i++){						
					tabs[i].className = (tabs[i].getAttribute('href').slice(1,-1) == href) ? 'active' : '';							
				}	
			});
		
			a.href = '#' + this.attr('path') + '/';			
			a.title = this.attr('description') || id;
			a.innerHTML = this.attr('label') || id;
			a.addEventListener('click',handler,true);
			if(this.attr('defaultNode'))a.className = 'active';
			tabs.push(a);
			li = document.createElement('li');
			li.appendChild(a);
			tabBar.appendChild(li);
		}		
	});
};


//Package: nesis/mvc/gui/nesis.mvc.gui.accordianStatic-1.0.js
nesis.mvc.gui.accordianStatic = function(e){
	if(!e.target instanceof View) return; 
	
	var frag=e.target,bars=frag.querySelectorAll('.mvc-accordian-actuator a'),i=0,l=bars.length,
		handler=function(e){
			e.preventDefault();
			for(i=0; i<l; i++){
				if(this == bars[i]){
					bars[i].className = 'active';
					frag.querySelector(bars[i].getAttribute('href')).style.display = 'block';
				}
				else{
					bars[i].className = '';
					frag.querySelector(bars[i].getAttribute('href')).style.display = 'none';
				}
				
			}
		};
	
		for(; i<l; i++){
			if(bars[i].className != 'active'){
				frag.querySelector(bars[i].getAttribute('href')).style.display = 'none';
			}
			bars[i].addEventListener('click',handler,false);
		}
};

//Package: nesis/mvc/gui/nesis.mvc.gui.formAjax-1.0.js
nesis.mvc.gui.formAjax = function(e){
	var frag=e.target,forms=frag.querySelectorAll('form'),fLen=forms.length;
	for(; fLen>0; fLen--){
		forms[fLen-1].addEventListener('submit',function(e){
			//var controller = app.controller(this.action.split('#')[1]),arr=[],inputs;
			//var controller = app.controller(this.action.split('#')[1]),obj={},inputs;
			var obj={},inputs;
			
			e.preventDefault();			
			inputs = this.querySelectorAll('input,select,textarea');
			for(var iLen=inputs.length; iLen>0; iLen--){				
				var i=iLen-1,n=inputs[i].name;
				//if(n) arr.push(n + '=' + inputs[i].value);
				if(n) obj[n] = inputs[i].value;
			}
			
			inputs = document.querySelectorAll('body *[form="' + this.id + '"]');
			for(var iLen=inputs.length; iLen>0; iLen--){
				var i=iLen-1,n=inputs[i].name;
				//if(n) arr.push(n + '=' + inputs[i].value);
				if(n) obj[n] = inputs[i].value;
			}
			//controller.model().save(arr.join('&'));
			frag.parent().model().save(obj);
		},true);
	}
};


//Package: nesis/mvc/gui/nesis.mvc.gui.textEditableAjax-1.0.js
nesis.mvc.gui.textEditableAjax = function(e){ 
	var frag=e.target,i=0,el=frag.querySelectorAll('*[contenteditable="true"]'),l=el.length;
	for(; i<l; i++){
		el[i].addEventListener('focus',function(e){
			var orig = this.innerHTML,
				blurHandler = function(e){
					this.removeEventListener('blur',blurHandler);
					if(orig != this.innerHTML){
						var obj = {};
						obj[this.id] = this.innerHTML.replace(/(<([^>]+)>)/ig,"");
						frag.parent().model().save(obj);
					}
				};
			
			this.addEventListener('blur',blurHandler,true);
		},true);
	}
};

//Package: nesis/mvc/gui/nesis.mvc.gui.lightbox-1.0.js
nesis.mvc.gui.lightbox = function(e){
	var frag = e.target,content=e.arguments[1]; 
	if(!frag instanceof View)return;
	
	frag.querySelector('.mvc-lightbox-close a').addEventListener('click',function(e){
		var lb = frag.querySelector('.mvc-lightbox').parentNode;
		lb.parentNode.removeChild(lb);
	},true);
	
	if(content) frag.querySelector('.mvc-lightbox-content').innerHTML = content;
};

//Package: nesis/mvc/gui/nesis.mvc.gui.tabsStatic-1.0.js
nesis.mvc.gui.tabsStatic = function(e){
	if(!e.target instanceof View) return;
	
	var frag=e.target,parts=frag.querySelector('.mvc-tabs').children,
		tabs=parts[0].querySelectorAll('a'),l=tabs.length;	
		handler=function(e){
			e.preventDefault();
			for(var i=0; i<l; i++){
				//IE loses variable parts so get content from the DOM
				var content = document.getElementById(tabs[i].getAttribute('href').slice(1));
				if(tabs[i] === this){
					tabs[i].className = 'active';
					content.style.display = 'block';
				}
				else{
					tabs[i].className = '';
					content.style.display = 'none';
				}				
			}
		};
	
	for(var i=0,l=tabs.length; i<l; i++){
		tabs[i].addEventListener('click',handler,false);
		if(tabs[i].className != 'active')
			parts[i+1].style.display = 'none';
	}
}; 

//Package: nesis/mvc/gui/nesis.mvc.gui.typeahead-1.0.js
nesis.mvc.gui.typeahead = function(e,options){
	if(!e.target instanceof View)return;
	
	var frag=e.target,placeholder=frag.querySelector('.mvc-typeahead'),fn,ds,handler,keys,
		sBox=document.createElement('input'),sBoxLen,
		rBox=document.createElement('ul'),
		dflt={
			datasource:undefined,
			results:true,
			searchOn:'id',
			resultValue:'id',
			resultLabel:'title',
			limit:5
		},popResults,preventDefault;
	
	options = options || {};
	for(var n in options){dflt[n] = options[n];}
	ds = dflt.datasource;
	preventDefault = (ds instanceof nesis.mvc.Model) ? false : true; 
	keys = dflt.searchOn.split(',');
	
	if(!ds || !placeholder){
		if(frag.attr('debug')){console.log('nesis.mvc.gui.typeahead(' + frag.attr('id') + '): Failed datasource or placeholer not found.');}
		return;
	}
		
//	if(ds instanceof nesis.mvc.Model){ 
	if(!preventDefault){ 
		if(dflt.results){
			ds.bind('aftersync',function(e){ 
				var r = e.arguments.data.data,
					path = ds.parent().attr('path');
				
				popResults(path,r);
			});
		}
		fn = function(e){ 
			var obj={limit:dflt.limit};
			for(var i=0,l=keys.length; i<l; i++){obj[keys[i]] = this.value;}
			ds.sync(obj,true);
		};
	}
	else if(ds instanceof Array){
		fn = function(e){
			var r=[],i=0,l=ds.length;
			for(; i<l; i++){ 
				for(var n in ds[i]){
					if(keys.indexOf(n)>-1){
						if(ds[i][n].search(new RegExp(this.value,'i')) > -1){
							var obj={};
							obj[dflt.resultValue] = ds[i][dflt.resultValue];
							obj[dflt.resultLabel] = ds[i][dflt.resultLabel];
							r.push(obj);
							break;
						}
					}
				}								
			}
			popResults(frag.parent().attr('path'),r);
		};
	}
	else{
		fn = function(e){
			var qStr = 'refresh=true&limit='+dflt.limit;
			for(var i=0,l=keys.length; i<l; i++){qStr+='&'+keys[i]+'='+this.value;}
			ds += (ds.indexOf('?') > 0) ? '&'+qStr : '?'+qStr;
			nesis.net.http.ajax(ds,{
				callback:function(res){
					var r = JSON.parse(res.responseText);
					popResults(frag.parent().attr('path'),r.data);
				}
			});
		};
	}
	
	handler=function(e){ 
		var l=this.value.length;			
		if(l > 2 || e.type != 'keyup'){
			rBox.style.display = 'block';
			sBoxLen = l;
			fn.call(this,e);
		}
		else rBox.style.display = 'none';
	};
	
	popResults = function(path,r){
		if(sBoxLen > 0 && r instanceof Array){
			var html = '',href,				
				l=(dflt.limit<r.length)? dflt.limit : r.length; 
					
			for(var i=0; i<l; i++){
				if(preventDefault)
					html += '<li><span data-value="' + r[i][dflt.resultValue] + '">' + r[i][dflt.resultLabel] + '</span></li>';
				else{
					href = '#'+ path + '/' + dflt.resultValue + ':' + r[i][dflt.resultValue] + '/refresh:true';
					html += '<li><a href="' + href + '">' + r[i][dflt.resultLabel] + '</a></li>';
				}
			}
			rBox.innerHTML = html;
		}
	};
	
	//setup searchbox
	sBox.value = e.arguments[0][sBox.name] || '';
	sBox.name= options.searchKey || 'search';
	sBox.type='text';
	sBox.setAttribute('placeholder','Search');
	sBox.title='Type to Search';
	sBoxLen=sBox.value.length;
	
	//Bind Events	
	sBox.addEventListener('keyup',handler,false);
	sBox.addEventListener('paste',function(e){
		setTimeout(function(){handler.call(sBox,e);});
	},false);
	sBox.addEventListener('cut',handler,false);
	rBox.addEventListener('click',function(e){
		sBox.value = e.target.innerHTML;
		this.style.display = 'none';
		if(preventDefault){
			var args={};
			args[dflt.resultValue] = e.target.getAttribute('data-value');
			args[dflt.resultLabel] = sBox.value;
			frag.trigger(new nesis.mvc.Event('change',{
				arguments:args
			}));
		}
	},false);
	
	//Insert into view
	placeholder.appendChild(sBox);
	placeholder.appendChild(rBox);
};


//Package: nesis/mvc/datasource/nesis.mvc.datasource.dom-1.0.js
nesis.mvc.datasource.dom = function(obj){
	var el = document.getElementById(obj.domId);
	if(!el){
		setTimeout(function(){
			nesis.mvc.datasource.dom(obj);
		},200);
	}
	else{
		obj.data = el.innerHTML;		
	}
	return obj;
};

//Package: nesis/mvc/datasource/nesis.mvc.datasource.ajax-1.0.js
nesis.mvc.datasource.ajax = function(obj){
	if(navigator.onLine)
		nesis.net.http.ajax(obj.url,obj);				
	else{//Untested
		var now = new Date(),reqId='onconnect'+o.attr('id')+now.getTime(),
		cb=function(){
			if(navigator.onLine)
				nesis.net.http.ajax(o.attr('remoteURL'),ajaxOpts);						
			else
				setTimeout(cb,this.mvc.ajaxReqCacheDelay);
		};
		ns[reqId] = setTimeout(cb,this.mvc.ajaxReqCacheDelay);
	}	
	return obj;
};

//Package: nesis/mvc/nesis.mvc.event-1.0.js
nesis.mvc.Event = function(eventType,data){
	if(!eventType || typeof eventType != 'string') return false;
	data = data || {};
	
	this.type = eventType;
	this.bubbles = data.bubbles || true;
	this.cancelable = data.cancelable || true;	
	this.arguments = data.arguments;
};

//Package: nesis/mvc/nesis.mvc.nodecollection-1.0.js
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
		for(i=0,l=arr.length; i<l; i++){
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

//Package: nesis/mvc/nesis.mvc.node-1.0.js
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

//Package: nesis/mvc/nesis.mvc.router-1.0.js
nesis.mvc.Router = function(options){
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

};


//Package: nesis/mvc/nesis.mvc.controller-1.0.js
;nesis.mvc.Controller = function(k,v){
	var ns=nesis.mvc,o=this,a={},x=[];
	
	
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
		args = args || {};
		var m = o.model(),rslt; 
		o.trigger(new ns.Event('beforeexecute',{arguments:args}));
		if(ns.debugTiming) console.log('execute: ' + o.attr('id'));
		if(m instanceof ns.Model){rslt = m.sync(args);}
		o.trigger(new ns.Event('afterexecute',{arguments:args}));
//if need to use rslt to stop flow put in some kind of bubble event				
		o.children().each(function(){
			if(this instanceof ns.Controller && this.attr('defaultNode'))
				this.execute(args);
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
			v = new ns.Model(attr);
			if(o.remove){
				if(m) o.remove(m);
				o.append(v);
			}
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
			v = new ns.View(attr,chldrn);
			if(o.remove){
				if(m) o.remove(m);
				o.append(v);
			}
			return v;
		}
	};
	
	//Start Constructor
	v.model = v.model || {};
	v.view = v.view || {};
	
	for(var n in v){
		if(n == 'model')x.push(o.model(v[n]));
		else if(n == 'view')x.push(o.view(v[n]));
		else if(n == 'subcontrollers' && typeof v[n] == 'object'){
			for(var id in v[n]){x.push(o.controller(id,v[n][id]));}
		} 
		else a[n] = v[n];
	}
	
	a.id = k;
	a.type = 'Controller';
	a.path = (a.parent) ? a.parent.attr('path') + '/' + a.id : a.id;
	
	ns.Node.call(o,a,x);
};
//Setup inheritance 
nesis.mvc.Controller.prototype = Object.create(nesis.mvc.Node.prototype);
nesis.mvc.Controller.constructor = nesis.mvc.Controller;


//Package: nesis/mvc/nesis.mvc.application-1.0.js
nesis.mvc.Application = function(v){
	var ns=nesis.mvc,o=this,cfg=v.config || {};//r=new ns.Router();
	
	v.config = undefined;
	
	//Start Constructor
	nesis._init(cfg);
	
	ns.Controller.call(o,'app',v);
	o.attr('router',new ns.Router());

	o.attr('router').addRoute(o.attr('path'),'execute',o);
	o.bind('create',function(e){
		o.attr('router').addRoute(e.target.attr('path'),'execute',e.target);
	});
};
//Setup inheritance 
nesis.mvc.Application.prototype = Object.create(nesis.mvc.Controller.prototype);
nesis.mvc.Application.constructor = nesis.mvc.Application;


//Package: nesis/mvc/nesis.mvc.model-1.0.js
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

//Package: nesis/mvc/nesis.mvc.view-1.0.js
nesis.mvc.View = function(a,x){
	var ns=nesis.mvc,o=this,model,oNode,frag,dsFunc,
		nodeSearch = function(needle,all){
			var hayStack = frag || oNode;
			if(all){
				return hayStack.querySelectorAll(needle);
			}
			return hayStack.querySelector(needle);
		};
		
	o.getElementsByTagName = function(name){
		try{
			document.createElement(name);
		}catch(err){return;};		
		return nodeSearch(name,[]);
	};
	
	o.model = function(){
		if(!model) model = o.parent().model();
		return model;
	};
	
	o.querySelector = function(qStr){
		return nodeSearch(qStr);
	};
	
	o.querySelectorAll = function(qStr){
		return nodeSearch(qStr,true);
	};
	
	o.render = function(args){
		var cType,span=document.createElement('span'),pNode=o.parent(),model=o.model();
		
		frag = document.createDocumentFragment();
		
		switch(model.attr('contentType')){
			case "text/html":
				span.innerHTML = args.data;
				break;
			case "text/xml":
				span.innerHTML = '';
				break;
			case "text/json":	
				var tpl = (args.tpl) ? o.children('id',args.tpl) : o.children('defaultNode',true)[0];
				if(tpl instanceof ns.Template) 
					tpl = tpl.transform(args.data);	
				if(tpl === false){
					return false;
				}
				span.innerHTML = tpl;
				break;
			default:
				try{throw Error("nesis.mvc." + o.attr('id') + ".render: ContentType " + model.attr('contentType') + " not supported");}
				catch(err){nesis.core.error.handle(err);};
		
		}		
		frag.appendChild(span);
	
		var evt = new ns.Event('beforerender',{arguments:arguments});
		o.trigger(evt);
		try{					
			oNode = document.getElementById(pNode.attr('path'));
			(oNode.firstChild)?oNode.replaceChild(frag,oNode.children[0]):oNode.appendChild(frag);
		}
		catch(err){
			err.message = "nesis.mvc." + o.attr('id') + ".render: document.getElementById('" + pNode.attr('path') + "') returned null";
			nesis.core.error.handle(err);
		}
		
		frag = null;
		o.trigger(new ns.Event('afterrender',{arguments:arguments}));
	};
	
	o.template=function(k,v){
		v.id = k;
		v.type = 'Template';
		v.parent = o;
		return new ns.Template(v);
	};
	
	//Start Constructor	
	//x.template would allow templates to be used with json
	a.type = 'View';
	
	var tpl = [];
	for(var n in x){tpl.push(o.template(n,x[n]));} 
	//ns.extend(a,b);
	ns.Node.call(o,a,tpl);

	o.find = undefined;

	if(typeof o.attr('onbeforerender')  == 'function')
		o.bind('beforerender',o.attr('onbeforerender'));
	if(typeof o.onafterrender  == 'function')
		o.bind('afterrender',o.attr('onafterrender'));
	if(model)
	;//	model.addEventListener('change',o.render);
	
	//Override methods
	o.getElementById = function(id){
		//These characters are reserved in css and must be escaped.  
		//As a variable output should be \char in string literal should be \\char
		id = id.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');			
		return nodeSearch('#'+id);
	};
};
//Setup inheritance 
nesis.mvc.View.prototype = Object.create(nesis.mvc.Node.prototype);
nesis.mvc.View.constructor = nesis.mvc.View;



//Package: nesis/mvc/nesis.mvc.template-1.0.js
nesis.mvc.Template = function(a,x){
	var ns=nesis.mvc,o=this,fn=ns.datasource.dom,cPrefix='nesis.mvc.template.',transformer,cObj,id,wait=false,
		callback = function(res){
			cObj.data = (o.attr('templateType') == 'xsl') ? res.responseXML : res.responseText;			
			ns.cache.set(cPrefix+id,cObj);  
			wait = false;
			return cObj;
		};
			
	o.transform = function(data){ 
		if(wait){
			setTimeout(function(){
				o.parent().render({data:data,tpl:id});
			},100);
			return false;
		}
		cObj.callback = function(res){ 
			var obj = callback(res);			
			o.parent().render({data:data,tpl:id});			
		}; 	
		
		cObj = ns.cache.get(cPrefix+id,cObj);
		if(!cObj.data) return false; 	
		return transformer(cObj.data,data);		
	};
	

	//Start Constructor
	if(!a.id)return; else id = a.id;
	a.datasource = (a.url) ? ns.datasource.ajax : ns.datasource.dom;
	a.persist = a.persist || true;	
	switch(a.templateType){
		case "javascript":
			transformer = function(tpl,data){			
				if(typeof tpl == 'function')return tpl(data);
				else{
					try{
						var fn = new Function("obj",
								"var p=[],print=function(){p.push.apply(p,arguments);};" +
							       
						        // Introduce the data as local variables using with(){}
						        "with(obj){p.push('" +
						       
						        // Convert the template into pure JavaScript
						        tpl
						          .replace(/[\r\t\n]/g, " ")
						          .split("<%").join("\t")
						          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
						          .replace(/\t=(.*?)%>/g, "',$1,'")
						          .split("\t").join("');")
						          .split("%>").join("p.push('")
						          .split("\r").join("\\'")
						      + "');}return p.join('');");
						return fn(data);						
					}
					catch(err){
						err.message = "nesis.mvc.template(" + id + ").transform: " + err.message;
						ns.error.handle(err);
					}
				}
			};
			break;
		case "xsl":
			transformer = function(tpl,data){};
			break;
		default:
			transformer = function(){
				if(o.debug)console.log('nesis.mvc.Template(' + id + '): Unsupporeted template type' + a.templateType);
			};
	}

	ns.Node.call(o,a,x);	
	
	cObj = {
		domId:a.domId,
		url:a.url,
		callback:callback,
		datasource:a.datasource,
		persist:a.persist,
		lastModified:a.lastModified,
		expires:a.expires
	};
	
	//Wait prevents duplicate ajax calls by delaying use of the transformer function.
	wait = true;
	var cObj = ns.cache.get(cPrefix+id,cObj);
	if(cObj.data) wait = false;
	
	o.append = undefined;
	o.bind = undefined;
	o.children = undefined;
	o.find = undefined;
	o.remove = undefined;
	o.trigger = undefined;
	o.unbind = undefined;
};
//Setup inheritance 
nesis.mvc.Template.prototype = Object.create(nesis.mvc.Node.prototype);
nesis.mvc.Template.constructor = nesis.mvc.Template;