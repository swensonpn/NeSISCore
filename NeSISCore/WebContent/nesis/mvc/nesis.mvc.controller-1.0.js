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
		var m = o.model(); 
		o.trigger(new ns.Event('beforeexecute',{arguments:args}));
		if(ns.debugTiming) console.log('execute: ' + o.attr('id'));
		if(m instanceof ns.Model) m.sync(args);	
		o.trigger(new ns.Event('afterexecute',{arguments:args}));
		
		
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
