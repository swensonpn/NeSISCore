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
	
	o.querySelector = function(qStr){
		return nodeSearch(qStr);
	};
	
	o.querySelectorAll = function(qStr){
		return nodeSearch(qStr,true);
	};
	
	o.render = function(args){
		var cType,span=document.createElement('span'),pNode=o.parent();
		
		frag = document.createDocumentFragment();
		if(!model) model = pNode.model(); 
		
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

//	for(var i=0,l=x.length; i<l; i++){o.append(o.template(o.parent().attr('path'),x[i]));}
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

