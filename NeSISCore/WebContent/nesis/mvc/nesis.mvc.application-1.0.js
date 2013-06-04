nesis.mvc.Application = function(v){
	var ns=nesis.mvc,o=this;//r=new ns.Router();
	
	
	//Start Constructor
	nesis._init();
	
	ns.Controller.call(o,'app',v);
	o.attr('router',new ns.Router());

	o.attr('router').addRoute(o.attr('path'),o.execute,o);
	o.bind('create',function(e){
		o.attr('router').addRoute(e.target.attr('path'),'execute',e.target);
	});
};
//Setup inheritance 
nesis.mvc.Application.prototype = Object.create(nesis.mvc.Controller.prototype);
nesis.mvc.Application.constructor = nesis.mvc.Application;
