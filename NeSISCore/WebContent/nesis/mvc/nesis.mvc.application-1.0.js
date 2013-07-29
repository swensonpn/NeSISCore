nesis.mvc.Application = function(appId,v){
	var ns=nesis.mvc,o=this,rootNode='root',r=new ns.Router(),
		addRoute=function(e){
		 	if(e.target instanceof ns.Controller)
		 		r.addRoute(e.target.attr('path'),'execute',e.target);
		};
	
	//Start Constructor
	v.config = v.config || {};
	v.oncreate = ns.fMerge(addRoute,v.oncreate) || addRoute;
	nesis._init(v.config);
	
	ns.Controller.call(o,appId + '.' + rootNode,v);
	o.attr('router',r);

};
//Setup inheritance 
nesis.mvc.Application.prototype = Object.create(nesis.mvc.Controller.prototype);
nesis.mvc.Application.constructor = nesis.mvc.Application;
