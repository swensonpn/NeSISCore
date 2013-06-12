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