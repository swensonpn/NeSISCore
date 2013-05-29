nesis.mvc.View = function(a,x){
	var ns=nesis.mvc,o=this,model,oNode,frag,bRenderEvent=new ns.Event('MVC'),aRenderEvent=new ns.Event('MVC'),
		nodeSearch = function(needle,all){
			var hayStack = frag || oNode;
			if(all){
				return hayStack.querySelectorAll(needle);
			}
			return hayStack.querySelector(needle);
		},
		toString = function(){			
			var i=0,l,str = o.id + ":{\n",
				authItems = ['id','oncreate','onchange','onbeforerender','onafterrender'];
				for(l=authItems.length; i<l; i++){
					str += '\t' + authItems[i] + ': ' + o[authItems[i]] + '\n';				
				}
				if(oNode && oNode instanceof HTMLElement) var inner = oNode.firstChild.innerHTML || '';
				str += '\trendered html: ' + inner + '\n';
			return str + '}\n';
		};
		
	o.attr = function(k){return o[k];};
		
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
	
	o.render = function(data){ 
		var cType,span=document.createElement('span'),pNode=o.parentNode;
		
		frag = document.createDocumentFragment();
		if(!model) model = pNode.model(); 
		
		switch(model.attr('contentType')){
			case "text/html":
				span.innerHTML = data;
				break;
			case "text/xml":
				span.innerHTML = '';
				break;
			case "text/json":
				span.innerHTML = '';
				break;
			default:
				try{throw Error("nesis.mvc." + o.id + ".render: ContentType " + model.attr('contentType') + " not supported");}
				catch(err){nesis.core.error.handle(err);};
		
		}		
		frag.appendChild(span);
		
		bRenderEvent.initEvent('beforerender',true,true,arguments);
		aRenderEvent.initEvent('afterrender',true,true,arguments);
		
		o.dispatchEvent(bRenderEvent);
		try{					
			oNode = document.getElementById(pNode.path);
			(oNode.firstChild)?oNode.replaceChild(frag,oNode.children[0]):oNode.appendChild(frag);
		}
		catch(err){
			err.message = "nesis.mvc." + o.id + ".render: document.getElementById('" + pNode.path + "') returned null";
			nesis.core.error.handle(err);
		}
		
		frag = null;
		o.dispatchEvent(aRenderEvent);
	};
	
	(function(a,x){		
		//x.template would allow templates to be used with json

		a.type = 'View';
		
		//ns.extend(a,b);
		ns.BaseObject.call(o,a,x);
		if(typeof o.onbeforerender  == 'function')
			o.addEventListener('beforerender',o.onbeforerender);
		if(typeof o.onafterrender  == 'function')
			o.addEventListener('afterrender',o.onafterrender);
		if(model)
		;//	model.addEventListener('change',o.render);
		
		//Override methods
		o.getElementById = function(id){
			//These characters are reserved in css and must be escaped.  
			//As a variable output should be \char in string literal should be \\char
			id = id.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');			
			return nodeSearch('#'+id);
		};
		
	})(a,x);
	
	return new function(){
		this.attr = o.attr;
		this.bind = o.addEventListener;
		this.render = o.render;
		this.toString = toString;
		this.unbind = o.removeEventListener;
	};
};
