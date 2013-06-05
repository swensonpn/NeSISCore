nesis.mvc.Template = function(a,x){
	var ns=nesis.mvc,o=this,fn=ns.datasource.dom,cPrefix='nesis.mvc.template.',transformer;
		
	
	o.transform = function(data){ 
		var obj=o.attr();
		obj = ns.cache.get(cPrefix+obj.id,obj);	
		return transformer(obj.data,data);		
	};
	

	//Start Constructor
	a.datasource = (a.url) ? ns.datasource.ajax : ns.datasource.dom;
	a.persist = a.persist || true;
	switch(a.templateType){
		case "javascript":
			transformer = function(tpl,data){			
				if(typeof tpl == 'function')return tpl(data);
				else{
					try{
						var obj = o.attr(),
							fn = new Function("obj",
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
						
						obj.data = fn;
						ns.cache.set(cPrefix+obj.id,obj);
						return fn(data);
					}
					catch(err){
						err.message = "nesis.mvc.template(" + obj.id + ").transform: " + err.message;
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
				if(o.debug)console.log('nesis.mvc.Template(' + a.id + '): Unsupporeted template type' + a.templateType);
			};
	}

	ns.Node.call(o,a,x);	
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