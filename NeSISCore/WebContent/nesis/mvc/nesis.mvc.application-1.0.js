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
